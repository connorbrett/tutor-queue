import { environment } from '@environments/environment';
import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay, take } from 'rxjs/operators';

const TRAILING_BACKSLASH = /\/$/g;

const LEADING_BACKSLASH = /^\//g;

interface HttpOptions {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  context?: HttpContext;
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
      };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  baseApiUrl: string;
  constructor(private http: HttpClient) {
    this.baseApiUrl = environment.apiHost;
  }

  private makeApiUrl(endpoint: string) {
    let cleanedEndpoint = endpoint;
    if (LEADING_BACKSLASH.test(cleanedEndpoint)) {
      cleanedEndpoint = cleanedEndpoint.replace(LEADING_BACKSLASH, '');
    }
    if (!TRAILING_BACKSLASH.test(cleanedEndpoint)) {
      cleanedEndpoint = cleanedEndpoint + '/';
    }
    return this.baseApiUrl + cleanedEndpoint;
  }

  public get<T>(endpoint: string, options?: HttpOptions) {
    return this.http.get<T>(this.makeApiUrl(endpoint), options).pipe(shareReplay(1), take(1));
  }

  public post<T>(endpoint: string, body: any | null, options?: HttpOptions) {
    return this.http.post<T>(this.makeApiUrl(endpoint), body, options);
  }

  public patch<T>(endpoint: string, body: any | null, options?: HttpOptions) {
    return this.http.patch<T>(this.makeApiUrl(endpoint), body, options);
  }

  public delete<T>(endpoint: string, options?: HttpOptions) {
    return this.http.delete<T>(this.makeApiUrl(endpoint), options);
  }

  public put<T>(endpoint: string, body: any | null, options?: HttpOptions) {
    return this.http.put<T>(this.makeApiUrl(endpoint), body, options);
  }
}
