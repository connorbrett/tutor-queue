import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from '../base-api/base-api.service';
import { Pageable } from '../base-api/paging.model';

const TRAILING_BACKSLASH = /\/$/g;

const LEADING_BACKSLASH = /^\//g;

/**
 *
 */
export class BaseService<T> {
  baseEndpoint: string;
  protected http: BaseApiService;

  /**
   *
   * @param http
   * @param baseEndpoint
   */
  constructor(http: BaseApiService, baseEndpoint: string) {
    this.baseEndpoint = baseEndpoint;
    this.http = http;
  }

  /**
   *
   * @param {...any} parts
   */
  public join(...parts: string[]) {
    return parts.join('/');
  }

  /**
   *
   * @param data
   */
  public create(data: any) {
    return this.http.post<T>(this.baseEndpoint, data);
  }

  /**
   *
   * @param id
   * @param data
   */
  public update(id: string, data: any) {
    return this.http.patch<T>(this.join(this.baseEndpoint, id), data);
  }

  /**
   *
   * @param params
   */
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

  /**
   *
   * @param params
   */
  public get(
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

  /**
   *
   * @param id
   * @param params
   */
  public getDetail(
    id: string,
    params?:
      | HttpParams
      | {
          [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
        }
  ) {
    return this.http.get<T>([this.baseEndpoint, id].join('/'), { params });
  }

  /**
   *
   * @param id
   */
  public delete(id: string) {
    return this.http.delete<T>(this.join(this.baseEndpoint, id));
  }
}
