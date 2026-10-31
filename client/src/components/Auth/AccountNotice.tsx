'use client';

import {Alert, Button} from 'antd';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {api} from '@/src/shared/api';
import {useAuth} from '@/src/shared/auth/AuthProvider';

// Напоминания под шапкой: подтвердить почту, включить 2FA для лейбла/админа
export default function AccountNotice() {
  const {user} = useAuth();
  const router = useRouter();
  const [sent, setSent] = useState(false);

  if (!user) return null;

  if (!user.emailVerified) {
    return (
      <div className="!max-w-[900px] !mx-auto !px-3 !mt-3">
        <Alert
          type="warning"
          showIcon
          message="Подтвердите почту"
          description={`Мы отправили ссылку на ${user.email}. Без подтверждения нельзя слушать треки, комментировать и создавать плейлисты.`}
          action={
            <Button
              size="small"
              disabled={sent}
              onClick={async () => {
                await api.post('/auth/resend-verification');
                setSent(true);
              }}
            >
              {sent ? 'Отправлено' : 'Отправить ещё раз'}
            </Button>
          }
        />
      </div>
    );
  }

  if (user.role !== 'user' && !user.totpEnabled) {
    return (
      <div className="!max-w-[900px] !mx-auto !px-3 !mt-3">
        <Alert
          type="error"
          showIcon
          message="Включите двухфакторную аутентификацию"
          description="Для лейбла и администратора она обязательна: без неё управление каталогом недоступно."
          action={<Button size="small" onClick={() => router.push('/profile')}>Включить</Button>}
        />
      </div>
    );
  }

  return null;
}
