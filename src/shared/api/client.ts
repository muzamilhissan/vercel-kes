import { ApiError } from './ApiError';
import { session } from '@/shared/auth/session';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | undefined>;
  /** Permission name echoed back to the API in the Permission headers. */
  permission?: string;
  /** Objects and arrays are JSON-encoded; FormData, Blob and strings are sent as-is. */
  body?: unknown;
}

function buildUrl(endpoint: string, params?: RequestOptions['params']): string {
  const url = `${BASE_URL}${endpoint}`;
  if (!params) return url;

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `${url}?${query}` : url;
}

function buildBody(body: unknown): BodyInit | null | undefined {
  if (body === undefined || body === null) return undefined;
  if (body instanceof FormData || body instanceof Blob || typeof body === 'string') return body;
  return JSON.stringify(body);
}

async function readError(response: Response): Promise<ApiError> {
  let message = `Request failed with status ${response.status}`;
  let body: unknown;
  try {
    body = await response.json();
    const data = body as { message?: string; error?: string };
    message = data?.message || data?.error || message;
  } catch {
    // Non-JSON error body — keep the status-based message.
  }
  return new ApiError(message, response.status, body);
}

export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, permission, body, ...rest } = options;
  const isFormData = body instanceof FormData;

  const requestHeaders: Record<string, string> = { Accept: 'application/json' };
  if (!isFormData) requestHeaders['Content-Type'] = 'application/json';

  const token = session.getToken();
  if (token) requestHeaders.Authorization = `Bearer ${token}`;

  if (permission) {
    requestHeaders.Permission = permission;
    requestHeaders['X-Permission'] = permission;
  }

  const response = await fetch(buildUrl(endpoint, params), {
    method: rest.method ?? 'GET',
    ...rest,
    body: buildBody(body),
    headers: { ...requestHeaders, ...headers },
  });

  if (!response.ok) {
    const error = await readError(response);
    if (error.isUnauthorized) session.clear();
    throw error;
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T;
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    return {} as T;
  }

  // This API reports refusals as 200 with `success: false` — for example deleting
  // a lead that still has follow-ups. Without this, a rejection would surface as
  // a success and the UI would report work it never did.
  if (payload && typeof payload === 'object' && (payload as { success?: unknown }).success === false) {
    const { message } = payload as { message?: string };
    throw new ApiError(message || 'The server rejected the request.', response.status, payload);
  }

  return payload as T;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) => apiFetch<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body?: RequestOptions['body'], options?: RequestOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'POST', body }),
  put: <T>(endpoint: string, body?: RequestOptions['body'], options?: RequestOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'PUT', body }),
  delete: <T>(endpoint: string, options?: RequestOptions) => apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};
