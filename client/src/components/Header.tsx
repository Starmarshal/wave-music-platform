'use client';

import { Button, Drawer, Layout, Menu } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const items = [
    {
      key: '1',
      label: 'Главная',
      onClick: () => {
        router.push('/');
        onClose();
      }
    },
    {
      key: '2',
      label: 'Список треков',
      onClick: () => {
        router.push('/tracks');
        onClose();
      }
    },
    {
      key: '3',
      label: 'Альбомы',
      onClick: () => {
        router.push('/albums');
        onClose();
      }
    },
  ];

  return (
    <>
      <div className="!w-full !text-center !p-2 sm:!p-3 md:!p-4 !flex !justify-between !items-center !bg-[#32c4d0] dark:!bg-cyan-700 !fixed !top-0 !z-[1000] !h-14 sm:!h-16">
        <Layout.Header className="!bg-transparent !w-full !h-full !flex !items-center !justify-start">
          <Button
            icon={<UnorderedListOutlined />}
            onClick={showDrawer}
            className="!ml-2 sm:!ml-4 !text-base sm:!text-lg !text-gray-800 dark:!text-gray-100 !bg-white dark:!bg-gray-800"
            size="large"
          />
          <div className="demo-logo" />
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
    </>
  );
};

export default Header;