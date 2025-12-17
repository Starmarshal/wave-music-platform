'use client';

import {Card, Col, Layout, Row, Typography} from 'antd';
import {useRouter} from 'next/navigation';
import {CustomerServiceOutlined, FolderOutlined} from '@ant-design/icons';

const MainContent = () => {
  const router = useRouter();

  return (
    <Layout.Content className="!bg-gradient-to-b !from-gray-50 dark:!from-gray-900 !to-white dark:!to-gray-800 !min-h-[calc(100vh-60px)] !flex !items-center !justify-center !text-center !flex !flex-col !text-white !p-2 sm:!p-4">
      <div className="!text-center !max-w-[800px] !mx-auto !px-3 sm:!px-5 !py-6 sm:!py-10 !w-full">
        <Typography.Title
          className="!text-cyan-500 dark:!text-cyan-400 !text-2xl sm:!text-3xl md:!text-4xl lg:!text-5xl !font-bold !mb-3 sm:!mb-5 !drop-shadow-lg"
        >
          Добро пожаловать!
        </Typography.Title>
        <Typography.Title
          level={3}
          className="!text-cyan-500 dark:!text-cyan-400 !font-normal !mb-8 sm:!mb-12 !drop-shadow-md !text-base sm:!text-lg md:!text-xl"
        >
          Здесь собраны лучшие треки и альбомы
        </Typography.Title>

        <Row
          gutter={[16, 16]}
          className="!mt-8 sm:!mt-12 md:!mt-16 !px-2 sm:!px-4"
        >
          <Col
            xs={24}
            sm={12}
            className="!flex !justify-center"
          >
            <Card
              hoverable
              onClick={() => router.push('/tracks')}
              className="!rounded-xl md:!rounded-2xl !text-center !p-4 sm:!p-6 md:!p-8 !bg-gradient-to-br !from-purple-500 !to-pink-600 !border-none !shadow-xl hover:!shadow-2xl !transition-all !duration-300 !min-h-[200px] sm:!min-h-[240px] md:!min-h-[280px] !flex !flex-col !items-center !justify-center !cursor-pointer hover:!-translate-y-2 !max-w-[400px] !w-full"
            >
              <CustomerServiceOutlined
                className="!text-4xl sm:!text-5xl md:!text-6xl !text-white !mb-3 sm:!mb-4 md:!mb-6"
              />
              <Typography.Title
                level={3}
                className="!text-white !mb-2 sm:!mb-3 md:!mb-4 !text-lg sm:!text-xl md:!text-2xl"
              >
                Треки
              </Typography.Title>
              <Typography.Text
                className="!text-white/90 !text-sm sm:!text-base"
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
              className="!rounded-xl md:!rounded-2xl !text-center !p-4 sm:!p-6 md:!p-8 !bg-gradient-to-br !from-pink-400 !to-red-500 !border-none !shadow-xl hover:!shadow-2xl !transition-all !duration-300 !min-h-[200px] sm:!min-h-[240px] md:!min-h-[280px] !flex !flex-col !items-center !justify-center !cursor-pointer hover:!-translate-y-2 !max-w-[400px] !w-full"
            >
              <FolderOutlined
                className="!text-4xl sm:!text-5xl md:!text-6xl !text-white !mb-3 sm:!mb-4 md:!mb-6"
              />
              <Typography.Title
                level={3}
                className="!text-white !mb-2 sm:!mb-3 md:!mb-4 !text-lg sm:!text-xl md:!text-2xl"
              >
                Альбомы
              </Typography.Title>
              <Typography.Text
                className="!text-white/90 !text-sm sm:!text-base"
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