'use client';

import {Button, Drawer, Layout, Menu} from 'antd';
import {UnorderedListOutlined} from '@ant-design/icons';
import styles from './Header.module.css';
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
      <Layout.Header className={styles.Header}>
        <Button
          className={styles.Button}
          icon={<UnorderedListOutlined />}
          onClick={showDrawer}
        />
        <div className="demo-logo" />
      </Layout.Header>
      <Drawer
        size={250}
        placement="left"
        onClose={onClose}
        open={open}
        style={{padding: 0}}
      >
        <Menu
          mode="vertical"
          items={items}
          style={{
            height: '100%',
            paddingTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        />
      </Drawer>
    </>
  );
};

export default Header;
