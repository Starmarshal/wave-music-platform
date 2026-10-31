'use client';

import {Button, message, Tooltip} from 'antd';
import {HeartFilled, HeartOutlined} from '@ant-design/icons';
import {useAuth} from '@/src/shared/auth/AuthProvider';
import usePlaybackGuard from '@/src/hooks/usePlaybackGuard';
import {LikeType} from '@/src/types/user';

type LikeButtonProps = {
  type: LikeType;
  id: string;
  size?: 'small' | 'middle' | 'large';
  withText?: boolean;
};

export default function LikeButton({type, id, size = 'middle', withText = false}: LikeButtonProps) {
  const {isLiked, toggleLike} = useAuth();
  const guard = usePlaybackGuard();
  const liked = isLiked(type, id);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!guard('ставить лайки')) return;
    try {
      await toggleLike(type, id);
    } catch {
      message.error('Не удалось сохранить лайк');
    }
  };

  return (
    <Tooltip title={liked ? 'Убрать из «Моей музыки»' : 'Добавить в «Мою музыку»'}>
      <Button
        type="text"
        size={size}
        onClick={handleClick}
        aria-label={liked ? 'Убрать лайк' : 'Поставить лайк'}
        icon={liked
          ? <HeartFilled className="!text-red-500" />
          : <HeartOutlined className="!text-gray-500 dark:!text-gray-400" />}
        className="!border-none !shadow-none"
      >
        {withText && <span className="dark:!text-gray-300">{liked ? 'В моей музыке' : 'Нравится'}</span>}
      </Button>
    </Tooltip>
  );
}
