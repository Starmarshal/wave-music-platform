export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://wave-music.pro/api';

export const staticUrl = (filePath: string) => {
  // Убираем лишние слэши и дублирование /static/
  const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  const pathWithoutStatic = cleanPath.startsWith('static/') ? cleanPath.slice(7) : cleanPath;
  return `${API_URL}/static/${pathWithoutStatic}`;
};
