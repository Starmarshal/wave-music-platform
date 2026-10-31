'use client';

import {Suspense, useState} from 'react';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {Button, Form, Input, message, Typography} from 'antd';
import AuthCard from '@/src/components/Auth/AuthCard';
import {api, apiError} from '@/src/shared/api';
import {useAuth} from '@/src/shared/auth/AuthProvider';

// Возвращаем только на свои страницы, чтобы ?next= нельзя было использовать для редиректа на чужой сайт
const safeNext = (next: string | null) =>
  next && next.startsWith('/') && !next.startsWith('//') ? next : '/';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get('next'));
  const {setUser} = useAuth();
  const [step, setStep] = useState<'credentials' | 'code'>('credentials');
  const [loading, setLoading] = useState(false);
  const [useBackupCode, setUseBackupCode] = useState(false);

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const {data} = await api.post('/auth/login', values);
      if (data.mfaRequired) {
        setStep('code');
      } else {
        setUser(data.user);
        router.replace(next);
      }
    } catch (error) {
      message.error(apiError(error, 'Не удалось войти'));
    } finally {
      setLoading(false);
    }
  };

  const handleCode = async (values: { code: string }) => {
    setLoading(true);
    try {
      const {data} = await api.post('/auth/login/2fa', values);
      setUser(data.user);
      router.replace(next);
    } catch (error) {
      message.error(apiError(error, 'Неверный код'));
    } finally {
      setLoading(false);
    }
  };

  if (step === 'code') {
    return (
      <AuthCard
        title="Подтверждение входа"
        subtitle={useBackupCode
          ? 'Введите один из резервных кодов, которые вы сохранили при включении 2FA'
          : 'Введите 6-значный код из приложения-аутентификатора'}
      >
        <Form layout="vertical" onFinish={handleCode} requiredMark={false}>
          <Form.Item
            name="code"
            rules={[{required: true, message: 'Введите код'}]}
          >
            <Input
              size="large"
              autoFocus
              autoComplete="one-time-code"
              inputMode={useBackupCode ? 'text' : 'numeric'}
              placeholder={useBackupCode ? 'xxxxx-xxxxx' : '123456'}
              className="!text-center !tracking-widest"
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={loading}>
            Войти
          </Button>
        </Form>
        <Button type="link" block className="!mt-2" onClick={() => setUseBackupCode(v => !v)}>
          {useBackupCode ? 'Ввести код из приложения' : 'Нет доступа к приложению? Резервный код'}
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Вход"
      subtitle="Слушать музыку можно только после входа"
      footer={<>Нет аккаунта? <Link href={`/register?next=${encodeURIComponent(next)}`}>Зарегистрироваться</Link></>}
    >
      <Form layout="vertical" onFinish={handleLogin} requiredMark={false}>
        <Form.Item
          label={<span className="dark:!text-gray-300">Почта</span>}
          name="email"
          rules={[{required: true, type: 'email', message: 'Введите почту'}]}
        >
          <Input size="large" autoComplete="email" autoFocus />
        </Form.Item>
        <Form.Item
          label={<span className="dark:!text-gray-300">Пароль</span>}
          name="password"
          rules={[{required: true, message: 'Введите пароль'}]}
        >
          <Input.Password size="large" autoComplete="current-password" />
        </Form.Item>
        <Typography.Paragraph className="!text-right !-mt-2">
          <Link href="/forgot-password">Забыли пароль?</Link>
        </Typography.Paragraph>
        <Button type="primary" htmlType="submit" size="large" block loading={loading}>
          Войти
        </Button>
      </Form>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
