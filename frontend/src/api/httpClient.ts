export type HttpMethod = "GET";

export type QueryParams = Record<string, string | number | undefined>;

export type HttpRequestOptions = {
  method?: HttpMethod;
  query?: QueryParams;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

const buildUrl = (path: string, query?: QueryParams): string => {
  const urlObj = new URL(path, API_BASE_URL);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined) return;
      urlObj.searchParams.set(key, String(value));
    });
  }

  return urlObj.toString();
};

export const fetchJson = async (
  path: string,
  options: HttpRequestOptions = {},
): Promise<unknown> => {
  const requestUrl = buildUrl(path, options.query);

  const response = await fetch(requestUrl, {
    method: options.method ?? "GET",
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  return response.json();
};
