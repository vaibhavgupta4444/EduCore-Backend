import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './api.config';

type ApiParams = Record<string, string | number | boolean | null | undefined>;

export type ApiOptions = {
  headers?: Record<string, string>;
  params?: ApiParams;
  withCredentials?: boolean;
  responseType?: 'json';
};

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL, { optional: true }) ?? '';

  get<T>(path: string, options: ApiOptions = {}): Observable<T> {
    return this.http.get<T>(this.buildUrl(path), this.buildOptions(options));
  }

  getText(path: string, options: Omit<ApiOptions, 'responseType'> = {}): Observable<string> {
    return this.http.get(this.buildUrl(path), {
      ...this.buildOptions(options),
      responseType: 'text'
    });
  }

  post<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
    options: ApiOptions = {}
  ): Observable<TResponse> {
    return this.http.post<TResponse>(
      this.buildUrl(path),
      body,
      this.buildOptions(options)
    );
  }

  put<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
    options: ApiOptions = {}
  ): Observable<TResponse> {
    return this.http.put<TResponse>(
      this.buildUrl(path),
      body,
      this.buildOptions(options)
    );
  }

  patch<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
    options: ApiOptions = {}
  ): Observable<TResponse> {
    return this.http.patch<TResponse>(
      this.buildUrl(path),
      body,
      this.buildOptions(options)
    );
  }

  delete<TResponse>(path: string, options: ApiOptions = {}): Observable<TResponse> {
    return this.http.delete<TResponse>(this.buildUrl(path), this.buildOptions(options));
  }

  postFile<TResponse>(path: string, formData: FormData, options: ApiOptions = {}): Observable<TResponse> {
    return this.http.post<TResponse>(
      this.buildUrl(path),
      formData,
      this.buildOptions(options)
    );
  }

  private buildUrl(path: string): string {
    if (!this.baseUrl) {
      return path;
    }

    const base = this.baseUrl.replace(/\/+$/, '');
    const target = path.startsWith('/') ? path : `/${path}`;
    return `${base}${target}`;
  }

  private buildOptions(options: ApiOptions) {
    const headers = options.headers ? new HttpHeaders(options.headers) : undefined;
    const params = options.params ? this.buildParams(options.params) : undefined;

    return {
      headers,
      params,
      withCredentials: options.withCredentials,
      responseType: options.responseType
    } as const;
  }

  private buildParams(params: ApiParams): HttpParams {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        return;
      }

      httpParams = httpParams.set(key, String(value));
    });

    return httpParams;
  }
}
