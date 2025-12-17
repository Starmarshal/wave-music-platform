'use client';

import {Input} from 'antd';

type TrackFormStep1Props = {
  name: string;
  artist: string;
  text: string;
  onNameChange: (value: string) => void;
  onArtistChange: (value: string) => void;
  onTextChange: (value: string) => void;
  namePlaceholder?: string;
  artistPlaceholder?: string;
  textPlaceholder?: string;
};

export default function TrackFormStep1({
                                         name,
                                         artist,
                                         text,
                                         onNameChange,
                                         onArtistChange,
                                         onTextChange,
                                         namePlaceholder = 'Название трека',
                                         artistPlaceholder = 'Имя исполнителя',
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
      <Input
        value={artist}
        onChange={(e) => onArtistChange(e.target.value)}
        placeholder={artistPlaceholder}
        size={'large'}
        className="!mb-3 sm:!mb-4 !h-[45px] sm:!h-[50px] dark:!bg-gray-700 dark:!border-gray-600 dark:!text-gray-200"
      />
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