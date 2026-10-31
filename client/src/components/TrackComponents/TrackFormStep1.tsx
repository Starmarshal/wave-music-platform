'use client';

import {Input, Select} from 'antd';
import Link from 'next/link';
import {IArtist} from '@/src/types/user';

type TrackFormStep1Props = {
  name: string;
  artistIds: string[];
  artists: IArtist[];
  text: string;
  onNameChange: (value: string) => void;
  onArtistIdsChange: (value: string[]) => void;
  onTextChange: (value: string) => void;
  namePlaceholder?: string;
  textPlaceholder?: string;
};

export default function TrackFormStep1({
                                         name,
                                         artistIds,
                                         artists,
                                         text,
                                         onNameChange,
                                         onArtistIdsChange,
                                         onTextChange,
                                         namePlaceholder = 'Название трека',
                                         textPlaceholder = 'Слова к треку'
                                       }: TrackFormStep1Props) {
  return (
    <div>
      <Input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder={namePlaceholder}
        size={'large'}
        className="!mb-3 sm:!mb-4 !h-[45px] sm:!h-[50px] dark:!bg-gray-700 dark:!border-gray-600 dark:!text-gray-200"
      />
      <Select
        mode="multiple"
        value={artistIds}
        onChange={onArtistIdsChange}
        placeholder="Исполнители (первый — основной)"
        size="large"
        optionFilterProp="label"
        options={artists.map((a) => ({value: a._id, label: a.name}))}
        className="!w-full !mb-1"
      />
      <div className="!mb-3 sm:!mb-4 !text-xs !text-gray-500 dark:!text-gray-400">
        Нет нужного артиста? Добавьте его в <Link href="/studio">студии</Link>.
      </div>
      <Input.TextArea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={textPlaceholder}
        size={'large'}
        className="!mb-3 sm:!mb-4 !h-30 !resize-none dark:!bg-gray-700 dark:!border-gray-600 dark:!text-gray-200"
        rows={4}
      />
    </div>
  );
}