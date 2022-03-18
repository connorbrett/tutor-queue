import { Observable, of, Subject } from 'rxjs';
import { mergeAll, shareReplay, switchMap } from 'rxjs/operators';
import { IHttpCacheStorage } from './cache.service';

/** copied from https://indepth.dev/posts/1450/how-to-use-ts-decorators-to-add-caching-logic-to-api-calls. */
type HttpRequestCacheMethod = (...args: any[]) => Observable<any>;

interface IHttpCacheOptions {
  storage: IHttpCacheStorage;
  refreshSubject: Subject<any>;
}
export function HttpRequestCache<T extends Record<string, any>>(optionsHandler: (this: T) => IHttpCacheOptions) {
  return (
    target: T,
    methodName: string,
    descriptor: TypedPropertyDescriptor<HttpRequestCacheMethod>
  ): TypedPropertyDescriptor<HttpRequestCacheMethod> => {
    if (!(descriptor?.value instanceof Function)) {
      throw Error(`'@HttpRequestCache' can be applied only to a class method that returns an Observable`);
    }

    const cacheKeyPrefix = `${target.constructor.name}_${methodName}`;
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]): Observable<any> {
      const { storage, refreshSubject } = optionsHandler.call(this as T);
      const key = `${cacheKeyPrefix}_${JSON.stringify(args)}`;
      let observable = storage.getItem(key);

      if (observable) {
        return observable;
      }

      const res = originalMethod.apply(this, args);

      observable = of(res, refreshSubject.pipe(switchMap(() => res))).pipe(mergeAll(), shareReplay(1));

      storage.setItem(key, observable);

      return observable;
    };

    return descriptor;
  };
}
