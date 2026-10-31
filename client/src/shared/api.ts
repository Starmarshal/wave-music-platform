import axios from 'axios';
import {API_URL} from './config';

// Сессия хранится в httpOnly-cookie, поэтому запросы идут с credentials
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Текст ошибки из ответа сервера (NestJS кладёт его в message, иногда массивом)
export const apiError = (error: unknown, fallback = 'Что-то пошло не так') => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message[0] ?? fallback;
    if (typeof message === 'string') return message;
  }
  return fallback;
};

export const apiErrorCode = (error: unknown): string | undefined =>
  axios.isAxiosError(error) ? error.response?.data?.code : undefined;
