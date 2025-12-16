'use client';

import {Button} from 'antd';
import {useRouter} from 'next/navigation';

type BackButtonProps = {
  href: string;
  text: string;
  style?: React.CSSProperties;
};

export default function BackButton({href, text, style}: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push(href)}
      className="!mx-5 !my-[15px] !text-base !h-10 !px-4 !py-2 !rounded-md !bg-cyan-500 !text-white !border-none !shadow-md hover:!bg-cyan-600 active:!bg-cyan-700 focus:!outline-none focus:!ring-2 focus:!ring-cyan-300"
      style={style}
    >
      ← {text}
    </Button>
  );
}