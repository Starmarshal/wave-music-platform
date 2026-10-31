'use client';

import {Avatar, Button, Drawer, Dropdown, Layout, Menu} from 'antd';
import {UnorderedListOutlined, UserOutlined} from '@ant-design/icons';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import Logo from '@/src/components/Logo';
import AccountNotice from '@/src/components/Auth/AccountNotice';
import {useAuth} from '@/src/shared/auth/AuthProvider';
import {staticUrl} from '@/src/shared/config';

const Header = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const {user, loading, hasRole, logout} = useAuth();

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const go = (path: string) => () => {
    router.push(path);
    onClose();
  };

  const items = [
    {key: 'home', label: 'Главная', onClick: go('/')},
    {key: 'tracks', label: 'Список треков', onClick: go('/tracks')},
    {key: 'albums', label: 'Альбомы', onClick: go('/albums')},
    {key: 'artists', label: 'Артисты', onClick: go('/artists')},
    {key: 'playlists', label: 'Плейлисты', onClick: go('/playlists')},
    {key: 'wave', label: 'Волна', onClick: go('/wave')},
    ...(user ? [{key: 'library', label: 'Моя музыка', onClick: go('/library')}] : []),
    ...(hasRole('label') ? [{key: 'studio', label: 'Студия', onClick: go('/studio')}] : []),
    ...(hasRole('admin') ? [{key: 'admin', label: 'Админка', onClick: go('/admin')}] : []),
  ];

  const userMenu = [
    {key: 'name', label: user?.displayName, disabled: true},
    {type: 'divider' as const},
    {key: 'profile', label: 'Профиль и безопасность', onClick: go('/profile')},
    {key: 'library', label: 'Моя музыка', onClick: go('/library')},
    ...(hasRole('label') ? [{key: 'studio', label: 'Студия', onClick: go('/studio')}] : []),
    ...(hasRole('admin') ? [{key: 'admin', label: 'Админка', onClick: go('/admin')}] : []),
    {type: 'divider' as const},
    {
      key: 'logout',
      label: 'Выйти',
      danger: true,
      onClick: async () => {
        await logout();
        router.push('/');
      },
    },
  ];

  return (
    <>
      <div className="!w-full !text-center !p-2 sm:!p-3 md:!p-4 !flex !justify-between !items-center !bg-[#32c4d0] dark:!bg-cyan-700 !fixed !top-0 !z-[1000] !h-14 sm:!h-16">
        <Layout.Header className="!bg-transparent !w-full !h-full !flex !items-center !justify-between">
          {/* Кнопка меню - слева */}
          <Button
            icon={<UnorderedListOutlined />}
            onClick={showDrawer}
            className="!ml-2 sm:!ml-4 !text-base sm:!text-lg !text-gray-100 !bg-transparent hover:!bg-transparent !border-none !shadow-none !p-0 !min-w-0"
            size="large"
            type="text"
          />

          {/* SVG логотип - по центру */}
          <div className="!absolute !left-1/2 !-translate-x-1/2 !flex !justify-center !items-center !mt-[10px]">
            <Logo />
          </div>

          {/* Аккаунт - справа */}
          <div className="!mr-1 sm:!mr-3 !flex !items-center">
            {loading ? null : user ? (
              <Dropdown
                menu={{items: userMenu}}
                trigger={['click']}
                placement="bottomRight"
              >
                <Avatar
                  src={user.avatar ? staticUrl(user.avatar) : undefined}
                  className="!cursor-pointer !bg-white/25 !text-white"
                  icon={<UserOutlined />}
                >
                  {user.displayName.slice(0, 1).toUpperCase()}
                </Avatar>
              </Dropdown>
            ) : (
              <Button
                size="small"
                className="!text-white !bg-transparent !border-white/80 hover:!bg-white/15"
                onClick={() => router.push('/login')}
              >
                Войти
              </Button>
            )}
          </div>
        </Layout.Header>

        <Drawer
          size={250}
          placement="left"
          onClose={onClose}
          open={open}
          className="
            !p-0
            dark:!bg-gray-800
            dark:[&_.ant-drawer-header]:!bg-gray-800
            dark:[&_.ant-drawer-header]:!border-gray-700
            dark:[&_.ant-drawer-title]:!text-gray-100
            dark:[&_.ant-drawer-close]:!text-gray-100
            dark:[&_.ant-drawer-close]:hover:!text-gray-300
            dark:[&_.ant-drawer-body]:!bg-gray-800
            dark:[&_.ant-drawer-body]:!text-gray-100
          "
          title="Меню"
          closeIcon={<UnorderedListOutlined className="!text-inherit" />}
        >
          <Menu
            mode="vertical"
            items={items}
            className="
              !h-full !pt-5 !flex !flex-col !gap-2.5
              dark:!bg-gray-800
              dark:[&_.ant-menu-item]:!text-gray-100
              dark:[&_.ant-menu-item]:hover:!text-gray-300
              dark:[&_.ant-menu-item]:hover:!bg-gray-700
              dark:[&_.ant-menu-item-selected]:!text-white
              dark:[&_.ant-menu-item-selected]:!bg-gray-900
              dark:[&_.ant-menu-item]:active:!bg-gray-700
            "
          />
        </Drawer>
      </div>

      <div className="!h-14 sm:!h-16"></div>
      <AccountNotice />
    </>
  );
};

export default Header;
