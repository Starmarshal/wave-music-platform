'use client';

import {Card, Layout} from 'antd';

const {Content} = Layout;

type TracksContainerProps = {
  children: React.ReactNode;
  maxWidth?: string | number;
  style?: React.CSSProperties;
};

export default function TracksContainer({
                                          children,
                                          maxWidth = '1200px',
                                          style = {}
                                        }: TracksContainerProps) {
  return (
    <Content
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '2rem',
        padding: '0 20px',
        minHeight: 'calc(100vh - 200px)',
        ...style
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: maxWidth,
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          border: 'none',
        }}
      >
        {children}
      </Card>
    </Content>
  );
}