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
      color="cyan"
      variant="solid"
      style={{
        margin: '15px 20px',
        fontSize: 16,
        height: 40,
        ...style
      }}
    >
      ← {text}
    </Button>
  );
}