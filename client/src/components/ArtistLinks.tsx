'use client';

import Link from 'next/link';
import {Fragment} from 'react';
import {IArtistRef} from '@/src/types/user';

type ArtistLinksProps = {
  artists?: IArtistRef[];
  // Строка для старых данных без привязанных артистов
  fallback: string;
  className?: string;
};

// "A, B & C" со ссылками на карточки артистов
export default function ArtistLinks({artists, fallback, className = ''}: ArtistLinksProps) {
  if (!artists?.length) return <span className={className}>{fallback}</span>;
  return (
    <span className={className}>
      {artists.map((artist, index) => (
        <Fragment key={artist._id}>
          {index > 0 && (index === artists.length - 1 ? ' & ' : ', ')}
          <Link
            href={`/artists/${artist.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="!text-inherit hover:!text-[#32c4d0] dark:hover:!text-cyan-400 hover:!underline"
          >
            {artist.name}
          </Link>
        </Fragment>
      ))}
    </span>
  );
}
