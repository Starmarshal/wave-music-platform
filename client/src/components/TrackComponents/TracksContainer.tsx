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
      className="!flex !justify-center !mt-8 !px-5 !min-h-[calc(100vh-200px)]"
      style={style}
    >
      <Card
        className="!w-full !max-w-[1200px] !p-7 !rounded-2xl !shadow-xl !border-none"
        style={{maxWidth: maxWidth}}
      >
        {children}
      </Card>
    </Content>
  );
}