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
      className="!mx-2 sm:!mx-4 md:!mx-5 !my-2 sm:!my-3 md:!my-[15px] !text-sm sm:!text-base !h-9 sm:!h-10 !px-3 sm:!px-4 !py-2 !rounded-md !bg-cyan-500 dark:!bg-cyan-600 !text-white !border-none !shadow-md hover:!bg-cyan-600 dark:hover:!bg-cyan-700 active:!bg-cyan-700 dark:active:!bg-cyan-800 focus:!outline-none focus:!ring-2 focus:!ring-cyan-300 dark:focus:!ring-cyan-500"
      style={style}
    >
      ← {text}
    </Button>
  );
}