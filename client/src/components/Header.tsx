'use client';

import {Button, Drawer, Layout, Menu} from 'antd';
import {UnorderedListOutlined} from '@ant-design/icons';
import {useState} from 'react';
import {useRouter} from 'next/navigation';

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
      {/* Header с фиксированной позицией */}
      <div className="!w-full !text-center !p-4 !flex !justify-between !items-center !bg-[#32c4d0] !fixed !top-0 !z-[1000] !h-16">
        <Layout.Header className="!bg-transparent !w-full !h-full !flex !items-center !justify-start">
          <Button
            icon={<UnorderedListOutlined />}
            onClick={showDrawer}
            className="!ml-4"
          />
          <div className="demo-logo" />
        </Layout.Header>
        <Drawer
          size={250}
          placement="left"
          onClose={onClose}
          open={open}
          className="!p-0"
        >
          <Menu
            mode="vertical"
            items={items}
            className="!h-full !pt-5 !flex !flex-col !gap-2.5"
          />
        </Drawer>
      </div>

      {/* Отступ для контента, чтобы он не перекрывался header */}
      <div className="!h-16"></div>
    </>
  );
};

export default Header;