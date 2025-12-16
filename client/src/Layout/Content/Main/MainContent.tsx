'use client';

import {Card, Col, Layout, Row, Typography} from 'antd';
import {useRouter} from 'next/navigation';
import {CustomerServiceOutlined, FolderOutlined} from '@ant-design/icons';

const MainContent = () => {
  const router = useRouter();

  return (
    <Layout.Content className="!bg-gradient-to-b !from-gray-50 !to-white !min-h-[calc(100vh-64px)] !flex !items-center !justify-center !text-center !flex !flex-col !justify-center !min-h-[calc(100vh-60px)] !text-white !p-4">
      <div className="!text-center !max-w-[800px] !mx-auto !px-5 !py-10 !w-full">
        <Typography.Title
          className="!text-cyan-500 !text-4xl sm:!text-5xl !font-bold !mb-5 !drop-shadow-lg"
        >
          Добро пожаловать!
        </Typography.Title>
        <Typography.Title
          level={3}
          className="!text-cyan-500 !font-normal !mb-12 !drop-shadow-md"
        >
          Здесь собраны лучшие треки и альбомы
        </Typography.Title>

        <Row
          gutter={[24, 24]}
          className="!mt-16 !px-4 sm:!px-0"
        >
          <Col
            xs={24}
            sm={12}
            className="!flex !justify-center"
          >
            <Card
              hoverable
              onClick={() => router.push('/tracks')}
              className="!rounded-2xl !text-center !p-8 !bg-gradient-to-br !from-purple-500 !to-pink-600 !border-none !shadow-xl hover:!shadow-2xl !transition-all !duration-300 !min-h-[280px] !flex !flex-col !items-center !justify-center !cursor-pointer hover:!-translate-y-2 !max-w-[400px] !w-full"
            >
              <CustomerServiceOutlined
                className="!text-6xl !text-white !mb-6"
              />
              <Typography.Title
                level={3}
                className="!text-white !mb-4"
              >
                Треки
              </Typography.Title>
              <Typography.Text
                className="!text-white/90 !text-base"
              >
                Прослушайте коллекцию лучших треков
              </Typography.Text>
            </Card>
          </Col>
          <Col
            xs={24}
            sm={12}
            className="!flex !justify-center"
          >
            <Card
              hoverable
              onClick={() => router.push('/albums')}
              className="!rounded-2xl !text-center !p-8 !bg-gradient-to-br !from-pink-400 !to-red-500 !border-none !shadow-xl hover:!shadow-2xl !transition-all !duration-300 !min-h-[280px] !flex !flex-col !items-center !justify-center !cursor-pointer hover:!-translate-y-2 !max-w-[400px] !w-full"
            >
              <FolderOutlined
                className="!text-6xl !text-white !mb-6"
              />
              <Typography.Title
                level={3}
                className="!text-white !mb-4"
              >
                Альбомы
              </Typography.Title>
              <Typography.Text
                className="!text-white/90 !text-base"
              >
                Исследуйте коллекцию альбомов
              </Typography.Text>
            </Card>
          </Col>
        </Row>
      </div>
    </Layout.Content>
  );
};

export default MainContent;