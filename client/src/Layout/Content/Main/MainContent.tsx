'use client';

import {Layout, Typography, Button, Row, Col, Card} from 'antd';
import {useRouter} from 'next/navigation';
import {CustomerServiceOutlined, FolderOutlined} from '@ant-design/icons';
import styles from './MainContent.module.css';

const MainContent = () => {
  const router = useRouter();

  return (
    <Layout.Content className={styles.Content}>
      <div
        style={{
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto',
          padding: '40px 20px'
        }}
      >
        <Typography.Title
          style={{
            color: '#32c2ce',
            fontSize: '48px',
            fontWeight: 700,
            marginBottom: '20px',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)',
          }}
        >
          Добро пожаловать!
        </Typography.Title>
        <Typography.Title
          level={3}
          style={{
            color: '#32c2ce',
            fontWeight: 400,
            marginBottom: '50px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          Здесь собраны лучшие треки и альбомы
        </Typography.Title>

        <Row
          gutter={[24, 24]}
          style={{marginTop: '60px'}}
        >
          <Col
            xs={24}
            sm={12}
          >
            <Card
              hoverable
              onClick={() => router.push('/tracks')}
              style={{
                borderRadius: '16px',
                textAlign: 'center',
                padding: '30px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                minHeight: '290px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
              }}
            >
              <CustomerServiceOutlined
                style={{
                  fontSize: '64px',
                  color: '#fff',
                  marginBottom: '20px'
                }}
              />
              <Typography.Title
                level={3}
                style={{color: '#fff', marginBottom: '16px'}}
              >
                Треки
              </Typography.Title>
              <Typography.Text
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '16px'
                }}
              >
                Прослушайте коллекцию лучших треков
              </Typography.Text>
            </Card>
          </Col>
          <Col
            xs={24}
            sm={12}
          >
            <Card
              hoverable
              onClick={() => router.push('/albums')}
              style={{
                borderRadius: '16px',
                textAlign: 'center',
                padding: '30px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                border: 'none',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                minHeight: '290px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
              }}
            >
              <FolderOutlined
                style={{
                  fontSize: '64px',
                  color: '#fff',
                  marginBottom: '20px'
                }}
              />
              <Typography.Title
                level={3}
                style={{color: '#fff', marginBottom: '16px'}}
              >
                Альбомы
              </Typography.Title>
              <Typography.Text
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '16px'
                }}
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
