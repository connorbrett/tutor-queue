import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { User, UserService } from '@services/user/user.service';

/**
 *
 */
@Injectable({
  providedIn: 'root',
})
export class AdminAuthGuard implements CanActivate, CanActivateChild {
  /**
   *
   * @param router
   * @param userService
   */
  constructor(private router: Router, private userService: UserService) {}

  /**
   *
   */
  isAdmin(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      const finish = (val: boolean) => {
        observer.next(val);
        observer.complete();
      };
      this.userService.getUser().subscribe({
        next: (currentUser) => {
          if (currentUser) {
            if (currentUser.is_coord) finish(true);
            else this.router.navigate(['/unauthorized']);
          } else finish(false);
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);

          finish(false);
        },
      });
    });
  }

  /**
   *
   */
  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAdmin();
  }

  /**
   *
   * @param route
   * @param state
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAdmin().pipe(
      tap((val) => {
        if (!val)
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: state.url },
          });
      })
    );
  }
  /**
   *
   * @param childRoute
   * @param state
   */
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAdmin().pipe(
      tap((val) => {
        if (!val)
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: state.url },
          });
      })
    );
  }
}
