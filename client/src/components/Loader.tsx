'use client';

import {LoadingOutlined} from '@ant-design/icons';
import {Flex, Spin} from 'antd';

const Loader = () => {
  return (
    <Flex
      align="center"
      justify="center"
      // Ширина по родителю: w-screen внутри блоков с отступами смещал лоадер вправо
      className="!min-h-[60vh] !w-full"
    >
      <Spin
        indicator={<LoadingOutlined
          className="!text-[120px] !text-[#32c4d0] dark:!text-cyan-400"
          spin
        />}
      />
    </Flex>
  );
};

export default Loader;