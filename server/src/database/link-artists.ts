/*
 * Создаёт карточки артистов из старых строк вида "Lida & DK", "madk1d, greyrock & tewiq"
 * и привязывает к ним треки и альбомы.
 *
 *   node dist/database/link-artists.js           — показать, что будет сделано (ничего не меняет)
 *   node dist/database/link-artists.js --apply   — применить
 *
 * Повторный запуск безопасен: треки и альбомы, у которых уже есть артисты, пропускаются.
 */
import * as fs from 'fs';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from './data-source';
import { generateId } from '../shared/object-id';
import { slugify, splitArtistNames } from '../shared/slug';

const run = async () => {
  if (fs.existsSync('.env')) {
    process.loadEnvFile('.env');
  }
  const apply = process.argv.includes('--apply');
  const db = await new DataSource(dataSourceOptions()).initialize();

  try {
    await db.runMigrations();

    const tracks: { id: string; artist: string }[] = await db.query(
      `SELECT id, artist FROM tracks t
       WHERE NOT EXISTS (SELECT 1 FROM track_artists ta WHERE ta.track_id = t.id)`,
    );
    const albums: { id: string; author: string }[] = await db.query(
      `SELECT id, author FROM albums a
       WHERE NOT EXISTS (SELECT 1 FROM album_artists aa WHERE aa.album_id = a.id)`,
    );

    // Имя артиста -> id; одинаковые имена в разном регистре и с пробелами считаем одним артистом
    const existing: { id: string; name: string; slug: string }[] =
      await db.query(`SELECT id, name, slug FROM artists`);
    const byKey = new Map(
      existing.map((a) => [a.name.trim().toLowerCase(), a]),
    );
    const slugs = new Set(existing.map((a) => a.slug));
    const created: { id: string; name: string; slug: string }[] = [];

    const artistFor = (name: string) => {
      const key = name.toLowerCase();
      let artist = byKey.get(key);
      if (!artist) {
        let slug = slugify(name);
        for (let i = 2; slugs.has(slug); i++) slug = `${slugify(name)}-${i}`;
        slugs.add(slug);
        artist = { id: generateId(), name, slug };
        byKey.set(key, artist);
        created.push(artist);
      }
      return artist;
    };

    const trackLinks = tracks.map((track) => ({
      id: track.id,
      source: track.artist,
      artists: splitArtistNames(track.artist).map(artistFor),
    }));
    const albumLinks = albums.map((album) => ({
      id: album.id,
      source: album.author,
      artists: splitArtistNames(album.author).map(artistFor),
    }));

    console.log(`New artists (${created.length}):`);
    for (const artist of [...created].sort((a, b) =>
      a.name.localeCompare(b.name),
    )) {
      const count = trackLinks.filter((t) => t.artists.includes(artist)).length;
      console.log(
        `  ${artist.name.padEnd(28)} /artists/${artist.slug}  (${count} tracks)`,
      );
    }
    console.log(`\nSplit artist strings:`);
    const sources = new Map<string, string[]>();
    for (const link of [...trackLinks, ...albumLinks]) {
      sources.set(
        link.source,
        link.artists.map((a) => a.name),
      );
    }
    for (const [source, names] of [...sources].sort()) {
      if (names.length > 1)
        console.log(`  "${source}" -> ${names.join(' | ')}`);
    }
    const empty = [...trackLinks, ...albumLinks].filter(
      (l) => !l.artists.length,
    );
    if (empty.length)
      console.warn(`\n${empty.length} items without artist name`);
    console.log(
      `\nTracks to link: ${trackLinks.length}, albums to link: ${albumLinks.length}`,
    );

    if (!apply) {
      console.log('\nDry run. Re-run with --apply to write changes.');
      return;
    }

    await db.transaction(async (manager) => {
      for (const artist of created) {
        await manager.query(
          `INSERT INTO artists (id, name, slug) VALUES ($1, $2, $3)`,
          [artist.id, artist.name, artist.slug],
        );
      }
      for (const link of trackLinks) {
        for (const [position, artist] of link.artists.entries()) {
          await manager.query(
            `INSERT INTO track_artists (track_id, artist_id, position) VALUES ($1, $2, $3)
             ON CONFLICT DO NOTHING`,
            [link.id, artist.id, position],
          );
        }
      }
      for (const link of albumLinks) {
        for (const [position, artist] of link.artists.entries()) {
          await manager.query(
            `INSERT INTO album_artists (album_id, artist_id, position) VALUES ($1, $2, $3)
             ON CONFLICT DO NOTHING`,
            [link.id, artist.id, position],
          );
        }
      }
      // Убираем лишние пробелы в старых строках (" Lida", "Платина ")
      await manager.query(`UPDATE tracks SET artist = trim(artist)`);
      await manager.query(`UPDATE albums SET author = trim(author)`);
    });
    console.log('\nApplied.');
  } finally {
    await db.destroy();
  }
};

run().catch((e) => {
  console.error('Failed:', e);
  process.exit(1);
});
