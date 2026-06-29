import type { AxiosError } from 'axios';

const DEFAULT_MESSAGE = 'Произошла ошибка. Попробуйте позже.';

export function extractApiError(e: unknown): string[] {
  const data = (e as AxiosError<any>)?.response?.data;
  if (data) {
    if (Array.isArray(data.error)) {
      return data.error.map((m: unknown) => String(m));
    }
    if (typeof data.error === 'string') {
      return [data.error];
    }
    if (typeof data.message === 'string') {
      return [data.message];
    }
  }
  return [DEFAULT_MESSAGE];
}
