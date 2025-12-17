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
      className="!flex !justify-center !mt-4 md:!mt-8 !px-2 sm:!px-4 md:!px-5 !min-h-[calc(100vh-200px)]"
      style={style}
    >
      <Card
        className={`!w-full !max-w-[1200px] !p-3 sm:!p-5 md:!p-7 !rounded-xl md:!rounded-2xl !shadow-md !backdrop-blur-lg !bg-white/10 dark:!bg-gray-500/10 !border !border-white/30 dark:!border-gray-700/20`}
        style={{maxWidth: maxWidth}}
      >
        {children}
      </Card>
    </Content>
  );
}