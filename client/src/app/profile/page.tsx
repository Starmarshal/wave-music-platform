'use client';

import {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  List,
  message,
  Modal,
  Popconfirm,
  QRCode,
  Tag,
  Typography,
} from 'antd';
import {useRouter} from 'next/navigation';
import Header from '@/src/components/Header';
import Loader from '@/src/components/Loader';
import useRequireUser from '@/src/hooks/useRequireUser';
import {useAuth} from '@/src/shared/auth/AuthProvider';
import {api, apiError} from '@/src/shared/api';
import {ROLE_NAMES} from '@/src/types/user';

const PASSWORD_RULE = /^(?=.*[A-Za-zА-Яа-яЁё])(?=.*\d).{8,128}$/;
const cardClass = '!w-full !shadow-lg !rounded-xl !mb-5 dark:!bg-gray-800 dark:!border-gray-700';
const titleClass = 'dark:!text-gray-200';

type SessionInfo = {
  _id: string;
  userAgent: string | null;
  ip: string | null;
  lastUsedAt: string;
  current: boolean;
};

// Коротко: «Chrome, Windows» из user-agent
const describeAgent = (ua: string | null) => {
  if (!ua) return 'Неизвестное устройство';
  const browser = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /YaBrowser/.test(ua) ? 'Яндекс Браузер'
    : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Браузер';
  const os = /Windows/.test(ua) ? 'Windows' : /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS'
    : /Mac OS/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : '';
  return os ? `${browser}, ${os}` : browser;
};

function BackupCodesModal({codes, onClose}: { codes: string[] | null; onClose: () => void }) {
  return (
    <Modal
      open={!!codes}
      title="Резервные коды"
      onCancel={onClose}
      footer={[
        <Button key="copy" onClick={() => {
          navigator.clipboard.writeText(codes!.join('\n'));
          message.success('Скопировано');
        }}>Скопировать</Button>,
        <Button key="ok" type="primary" onClick={onClose}>Я сохранил коды</Button>,
      ]}
      maskClosable={false}
    >
      <Alert
        type="warning"
        showIcon
        className="!mb-4"
        message="Сохраните коды в надёжном месте"
        description="Каждый код можно использовать один раз для входа без телефона. Больше мы их не покажем."
      />
      <div className="!grid !grid-cols-2 !gap-2 !font-mono !text-base">
        {codes?.map((code) => <div key={code} className="!text-center !p-1 !bg-gray-100 dark:!bg-gray-700 !rounded">{code}</div>)}
      </div>
    </Modal>
  );
}

function TwoFactorSection() {
  const {user, refresh} = useAuth();
  const [setup, setSetup] = useState<{ secret: string; otpauthUrl: string } | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [codesLeft, setCodesLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const loadStatus = useCallback(() => {
    api.get('/auth/2fa').then(({data}) => setCodesLeft(data.backupCodesLeft)).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (user?.totpEnabled) loadStatus();
  }, [user?.totpEnabled, loadStatus]);

  const startSetup = async () => {
    setLoading(true);
    try {
      const {data} = await api.post('/auth/2fa/setup');
      setSetup(data);
    } catch (error) {
      message.error(apiError(error));
    } finally {
      setLoading(false);
    }
  };

  const enable = async ({code}: { code: string }) => {
    setLoading(true);
    try {
      const {data} = await api.post('/auth/2fa/enable', {code});
      setSetup(null);
      setBackupCodes(data.backupCodes);
      await refresh();
      message.success('Двухфакторная аутентификация включена');
    } catch (error) {
      message.error(apiError(error, 'Неверный код'));
    } finally {
      setLoading(false);
    }
  };

  const disable = async (values: { password: string; code: string }) => {
    setLoading(true);
    try {
      await api.post('/auth/2fa/disable', values);
      await refresh();
      message.success('Двухфакторная аутентификация отключена');
    } catch (error) {
      message.error(apiError(error));
    } finally {
      setLoading(false);
    }
  };

  const regenerate = async ({code}: { code: string }) => {
    setLoading(true);
    try {
      const {data} = await api.post('/auth/2fa/backup-codes', {code});
      setBackupCodes(data.backupCodes);
      loadStatus();
    } catch (error) {
      message.error(apiError(error, 'Неверный код'));
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Card className={cardClass} title={<span className={titleClass}>Двухфакторная аутентификация</span>}>
      <BackupCodesModal codes={backupCodes} onClose={() => setBackupCodes(null)} />
      {user.totpEnabled ? (
        <>
          <Typography.Paragraph className="dark:!text-gray-300">
            <Tag color="green">Включена</Tag> При входе нужен код из приложения.
            {codesLeft !== null && ` Неиспользованных резервных кодов: ${codesLeft}.`}
          </Typography.Paragraph>
          <Typography.Text strong className={titleClass}>Новые резервные коды</Typography.Text>
          <Form layout="inline" onFinish={regenerate} className="!mt-2 !mb-5">
            <Form.Item name="code" rules={[{required: true, message: 'Код'}]}>
              <Input placeholder="Код из приложения" autoComplete="one-time-code" />
            </Form.Item>
            <Button htmlType="submit" loading={loading}>Сгенерировать</Button>
          </Form>
          {user.role === 'user' ? (
            <>
              <Typography.Text strong className={titleClass}>Отключить</Typography.Text>
              <Form layout="inline" onFinish={disable} className="!mt-2 !gap-y-2">
                <Form.Item name="password" rules={[{required: true, message: 'Пароль'}]}>
                  <Input.Password placeholder="Пароль" autoComplete="current-password" />
                </Form.Item>
                <Form.Item name="code" rules={[{required: true, message: 'Код'}]}>
                  <Input placeholder="Код" autoComplete="one-time-code" />
                </Form.Item>
                <Button danger htmlType="submit" loading={loading}>Отключить</Button>
              </Form>
            </>
          ) : (
            <Typography.Text type="secondary">Для лейбла и администратора отключить 2FA нельзя.</Typography.Text>
          )}
        </>
      ) : setup ? (
        <div className="!flex !flex-col sm:!flex-row !gap-6 !items-center sm:!items-start">
          <div className="!bg-white !p-2 !rounded-lg">
            <QRCode value={setup.otpauthUrl} size={180} bordered={false} />
          </div>
          <div className="!flex-1 !w-full">
            <ol className="!list-decimal !pl-5 !space-y-1 dark:!text-gray-300">
              <li>Установите приложение: Google Authenticator, Яндекс Ключ, Microsoft Authenticator или аналог.</li>
              <li>Отсканируйте QR-код или введите ключ вручную.</li>
              <li>Введите 6-значный код из приложения.</li>
            </ol>
            <Typography.Paragraph copyable={{text: setup.secret}} className="!font-mono !text-xs !break-all !mt-3 dark:!text-gray-300">
              {setup.secret}
            </Typography.Paragraph>
            <Form layout="inline" onFinish={enable}>
              <Form.Item name="code" rules={[{required: true, message: 'Введите код'}]}>
                <Input placeholder="123456" inputMode="numeric" autoComplete="one-time-code" autoFocus />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>Включить</Button>
            </Form>
          </div>
        </div>
      ) : (
        <>
          <Typography.Paragraph className="dark:!text-gray-300">
            {user.role === 'user'
              ? 'Защитите аккаунт: кроме пароля при входе понадобится код из приложения на телефоне.'
              : 'Для вашей роли двухфакторная аутентификация обязательна — без неё управление каталогом недоступно.'}
          </Typography.Paragraph>
          <Button type="primary" onClick={startSetup} loading={loading}>Настроить</Button>
        </>
      )}
    </Card>
  );
}

function SessionsSection() {
  const {logout} = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionInfo[]>([]);

  const load = useCallback(() => {
    api.get('/auth/sessions').then(({data}) => setSessions(data)).catch(() => undefined);
  }, []);

  useEffect(load, [load]);

  return (
    <Card className={cardClass} title={<span className={titleClass}>Активные сессии</span>}>
      <List
        dataSource={sessions}
        renderItem={(session) => (
          <List.Item
            actions={session.current ? [<Tag key="c" color="blue">Это устройство</Tag>] : [
              <Button key="end" size="small" onClick={async () => {
                await api.delete(`/auth/sessions/${session._id}`);
                load();
              }}>Завершить</Button>,
            ]}
          >
            <List.Item.Meta
              title={<span className={titleClass}>{describeAgent(session.userAgent)}</span>}
              description={<span className="dark:!text-gray-400">
                {session.ip ?? '—'} · активность {new Date(session.lastUsedAt).toLocaleString('ru-RU')}
              </span>}
            />
          </List.Item>
        )}
      />
      <Popconfirm
        title="Выйти на всех устройствах?"
        okText="Выйти"
        cancelText="Отмена"
        onConfirm={async () => {
          await logout(true);
          router.push('/login');
        }}
      >
        <Button danger className="!mt-3">Выйти на всех устройствах</Button>
      </Popconfirm>
    </Card>
  );
}

export default function ProfilePage() {
  const {user, ready} = useRequireUser();
  const {setUser} = useAuth();
  const [saving, setSaving] = useState(false);
  const [resent, setResent] = useState(false);
  const [passwordForm] = Form.useForm();

  if (!ready || !user) {
    return (<><Header /><Loader /></>);
  }

  const saveProfile = async (values: { displayName: string }) => {
    setSaving(true);
    try {
      const {data} = await api.patch('/auth/profile', values);
      setUser(data.user);
      message.success('Сохранено');
    } catch (error) {
      message.error(apiError(error));
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (values: { currentPassword: string; newPassword: string }) => {
    try {
      await api.post('/auth/change-password', values);
      passwordForm.resetFields();
      message.success('Пароль изменён, остальные сессии завершены');
    } catch (error) {
      message.error(apiError(error));
    }
  };

  return (
    <>
      <Header />
      <div className="!max-w-[760px] !mx-auto !px-3 !py-6">
        <Typography.Title level={2} className="!text-[#32c2ce] dark:!text-cyan-400">Профиль</Typography.Title>

        <Card className={cardClass} title={<span className={titleClass}>Аккаунт</span>}>
          <Descriptions column={1} size="small" className="!mb-4">
            <Descriptions.Item label="Почта">
              <span className="dark:!text-gray-200">{user.email}</span>
              {user.emailVerified
                ? <Tag color="green" className="!ml-2">подтверждена</Tag>
                : <Tag color="orange" className="!ml-2">не подтверждена</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="Роль">
              <span className="dark:!text-gray-200">{ROLE_NAMES[user.role]}</span>
              {user.label && <span className="dark:!text-gray-300"> · {user.label.name}</span>}
            </Descriptions.Item>
          </Descriptions>
          {!user.emailVerified && (
            <Button className="!mb-4" disabled={resent} onClick={async () => {
              await api.post('/auth/resend-verification');
              setResent(true);
              message.success('Письмо отправлено');
            }}>
              {resent ? 'Письмо отправлено' : 'Отправить письмо ещё раз'}
            </Button>
          )}
          <Form layout="inline" initialValues={{displayName: user.displayName}} onFinish={saveProfile}>
            <Form.Item name="displayName" rules={[{required: true, min: 2, max: 64, message: 'От 2 до 64 символов'}]}>
              <Input placeholder="Имя" />
            </Form.Item>
            <Button htmlType="submit" loading={saving}>Сохранить имя</Button>
          </Form>
        </Card>

        <TwoFactorSection />

        <Card className={cardClass} title={<span className={titleClass}>Смена пароля</span>}>
          <Form form={passwordForm} layout="vertical" onFinish={changePassword} requiredMark={false} className="!max-w-[360px]">
            <Form.Item name="currentPassword" label={<span className="dark:!text-gray-300">Текущий пароль</span>}
              rules={[{required: true, message: 'Введите текущий пароль'}]}>
              <Input.Password autoComplete="current-password" />
            </Form.Item>
            <Form.Item name="newPassword" label={<span className="dark:!text-gray-300">Новый пароль</span>}
              rules={[{required: true, pattern: PASSWORD_RULE, message: 'От 8 символов, буква и цифра'}]}>
              <Input.Password autoComplete="new-password" />
            </Form.Item>
            <Button htmlType="submit">Сменить пароль</Button>
          </Form>
        </Card>

        <SessionsSection />
      </div>
    </>
  );
}
