import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '@services/user/user.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private userService: UserService) {}

  private isLoggedIn() {
    return new Observable<boolean>((observer) => {
      const finish = (val: boolean) => {
        observer.next(val);
        observer.complete();
      };
      this.userService.getUser().subscribe({
        next: () => finish(true),
        error: (err: HttpErrorResponse) => {
          console.error(err);
          finish(false);
        },
      });
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isLoggedIn().pipe(
      tap((val) => {
        if (!val) {
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: state.url },
          });
        }
      })
    );
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isLoggedIn().pipe(
      tap((val) => {
        if (!val)
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: state.url },
          });
      })
    );
  }
}
