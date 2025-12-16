'use client';

import {LoadingOutlined} from '@ant-design/icons';
import {Flex, Spin} from 'antd';

const Loader = () => {
  return (
    <Flex
      align="center"
      justify="center"
      className="!h-[80vh] !w-screen"
    >
      <Spin
        indicator={<LoadingOutlined
          className="!text-[120px]"
          spin
        />}
      />
    </Flex>
  );
};

export default Loader;