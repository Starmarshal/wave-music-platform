'use client';

import {Suspense, useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {Result, Spin} from 'antd';
import AuthCard from '@/src/components/Auth/AuthCard';
import {api, apiError} from '@/src/shared/api';
import {useAuth} from '@/src/shared/auth/AuthProvider';

function VerifyEmail() {
  const params = useSearchParams();
  const token = params.get('token');
  const {refresh} = useAuth();
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');
  const [error, setError] = useState('');
  // Токен одноразовый: в StrictMode эффект вызывается дважды, второй запрос получил бы ошибку
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    if (!token) {
      setState('error');
      setError('В ссылке нет токена');
      return;
    }
    api.post('/auth/verify-email', {token})
      .then(() => {
        setState('ok');
        refresh();
      })
      .catch((e) => {
        setState('error');
        setError(apiError(e, 'Ссылка недействительна или устарела'));
      });
  }, [token, refresh]);

  return (
    <AuthCard title="Подтверждение почты">
      {state === 'loading' && <div className="!text-center !py-6"><Spin /></div>}
      {state === 'ok' && (
        <Result
          status="success"
          title="Почта подтверждена"
          extra={<Link href="/tracks">Перейти к трекам</Link>}
        />
      )}
      {state === 'error' && (
        <Result
          status="error"
          title="Не получилось"
          subTitle={`${error}. Запросите новое письмо в профиле.`}
          extra={<Link href="/profile">Открыть профиль</Link>}
        />
      )}
    </AuthCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmail />
    </Suspense>
  );
}
