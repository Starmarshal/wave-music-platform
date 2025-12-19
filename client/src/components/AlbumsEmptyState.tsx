'use client';

interface AlbumsEmptyStateProps {
  message?: string;
}

export default function AlbumsEmptyState({
                                           message = 'Альбомов пока нет'
                                         }: AlbumsEmptyStateProps) {
  return (
    <div className="!flex !flex-col !items-center !justify-center !py-10 !text-center">
      <div className="!text-6xl !mb-4">🎵</div>
      <h3 className="!text-xl !font-medium !mb-2 !text-gray-700 dark:!text-gray-300">
        {message}
      </h3>
      <p className="!text-gray-500 dark:!text-gray-400 !max-w-md">
        {message.includes('не найдены')
          ? 'Попробуйте изменить запрос поиска'
          : 'Будьте первым, кто добавит альбом'}
      </p>
    </div>
  );
}