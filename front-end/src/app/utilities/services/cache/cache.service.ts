import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const THRESHOLD = 10000;

export interface IHttpCacheStorage {
  setItem(key: string, item: Observable<any>): void;
  getItem(key: string): Observable<any> | undefined;
  deleteItem(key: string): void;
}

interface CacheEntry {
  timestamp: Date;
  value: Observable<any>;
}

@Injectable({
  providedIn: 'root',
})
export class CacheService implements IHttpCacheStorage {
  cache: { [key: string]: CacheEntry } = {};

  getItem(key: string): Observable<any> | undefined {
    const value = this.cache[key];
    if (value) {
      if (this.withinThreshold(value)) {
        return value.value;
      } else {
        delete this.cache[key];
        return undefined;
      }
    }
    return undefined;
  }

  setItem(key: string, item: Observable<any>): void {
    this.cache[key] = {
      value: item,
      timestamp: new Date(),
    };
  }

  deleteItem(key: string): void {
    delete this.cache[key];
  }

  withinThreshold(entry: CacheEntry) {
    return new Date().getTime() - entry.timestamp.getTime() < THRESHOLD;
  }
}
