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
        style={{marginBottom: '1rem', height: '50px'}}
      />
      <Input
        value={artist}
        onChange={(e) => onArtistChange(e.target.value)}
        placeholder={artistPlaceholder}
        size={'large'}
        style={{marginBottom: '1rem', height: '50px'}}
      />
      <Input.TextArea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={textPlaceholder}
        size={'large'}
        style={{marginBottom: '1rem', height: 120, resize: 'none'}}
        rows={4}
      />
    </div>
  );
}