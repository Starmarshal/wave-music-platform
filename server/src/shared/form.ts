// multipart-формы присылают списки по-разному: key, key[] или "a,b,c"
export const parseIdList = (
  body: Record<string, unknown>,
  key: string,
): string[] | undefined => {
  const raw = body[key] ?? body[`${key}[]`];
  if (raw === undefined) return undefined;
  const values = Array.isArray(raw) ? raw : String(raw).split(',');
  return values.map((value) => String(value).trim()).filter(Boolean);
};
