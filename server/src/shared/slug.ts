const CYRILLIC: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
};

// "Три дня дождя" -> "tri-dnya-dozhdya"
export const slugify = (value: string) => {
  const slug = value
    .toLowerCase()
    .split('')
    .map((char) => CYRILLIC[char] ?? char)
    .join('')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
  return slug || 'artist';
};

// Строка артистов трека из списка имён: "A", "A & B", "A, B & C"
export const joinArtistNames = (names: string[]) =>
  names.length <= 1
    ? (names[0] ?? '')
    : `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`;

// Обратная операция для старых данных: "A, B & C" -> ["A", "B", "C"]
export const splitArtistNames = (value: string) =>
  value
    .split(/\s*(?:,|&|\bfeat\.?\s|\bft\.?\s)\s*/i)
    .map((name) => name.trim())
    .filter(Boolean);
