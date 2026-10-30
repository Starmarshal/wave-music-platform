import { randomBytes } from 'crypto';

// Генерирует id в формате MongoDB ObjectId (24 hex-символа, начинается с времени),
// чтобы новые записи были совместимы со старыми id и ссылками на фронтенде
export const generateId = (): string => {
  const timestamp = Math.floor(Date.now() / 1000)
    .toString(16)
    .padStart(8, '0');
  return timestamp + randomBytes(8).toString('hex');
};
