import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from '../base-api/base-api.service';
import { Pageable } from '../base-api/paging.model';

const TRAILING_BACKSLASH = /\/$/g;

const LEADING_BACKSLASH = /^\//g;

export class BaseService<T> {
  baseEndpoint: string;
  protected http: BaseApiService;

  constructor(http: BaseApiService, baseEndpoint: string) {
    this.baseEndpoint = baseEndpoint;
    this.http = http;
  }

  private join(...parts: string[]) {
    return parts.join('/');
  }

  public create(data: any) {
    return this.http.post<T>(this.baseEndpoint, data);
  }

  public update(id: string, data: any) {
    return this.http.patch<T>(this.join(this.baseEndpoint, id), data);
  }

  public getAll(
    params?:
      | HttpParams
      | {
          [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
        }
  ) {
    return this.http.get<Pageable<T>>(this.baseEndpoint, {
      params,
    });
  }

  public get(
    params:
      | HttpParams
      | {
          [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
        }
  ) {
    return this.http.get<Pageable<T>>(this.baseEndpoint, {
      params,
    });
  }

  public delete(id: string) {
    return this.http.delete<T>(this.join(this.baseEndpoint, id));
  }
}
