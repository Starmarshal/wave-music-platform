'use client';

import {useEffect} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {useAuth} from '@/src/shared/auth/AuthProvider';
import {Role} from '@/src/types/user';

// Страница только для вошедших (и, если указано, с нужной ролью).
// ready = можно рендерить содержимое
export default function useRequireUser(role?: Role) {
  const {user, loading, hasRole} = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    } else if (role && !hasRole(role)) {
      router.replace('/');
    }
  }, [loading, user, role, hasRole, router, pathname]);

  return {user, ready: !loading && !!user && (!role || hasRole(role))};
}
