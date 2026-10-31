'use client';

import {useCallback} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {message} from 'antd';
import {useAuth} from '@/src/shared/auth/AuthProvider';

// Слушать можно только после входа и подтверждения почты.
// guard() возвращает true, если можно действовать, иначе отправляет на вход
export default function usePlaybackGuard() {
  const {user} = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  return useCallback((action = 'слушать музыку') => {
    if (!user) {
      message.info(`Войдите, чтобы ${action}`);
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return false;
    }
    if (!user.emailVerified) {
      message.warning('Подтвердите почту — ссылка в письме после регистрации');
      router.push('/profile');
      return false;
    }
    return true;
  }, [user, router, pathname]);
}
