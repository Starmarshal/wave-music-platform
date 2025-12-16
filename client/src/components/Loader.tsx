'use client';

import {LoadingOutlined} from '@ant-design/icons';
import {Flex, Spin} from 'antd';

const Loader = () => {
  return (
    <Flex
      align="center"
      justify="center"
      style={{height: '80vh', width: '100vw'}}
    >
      <Spin
        indicator={<LoadingOutlined
          style={{fontSize: 120}}
          spin
        />}
      />
    </Flex>
  );
};

export default Loader;
