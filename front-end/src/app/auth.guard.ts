import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Observable<boolean>((observer) => {
      const finish = (val: boolean) => {
        observer.next(val);
        observer.complete();
      };
      this.userService.getUser().subscribe({
        next: () => finish(true),
        error: (err: HttpErrorResponse) => {
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: state.url },
          });
          finish(false);
        },
      });
    });
  }
}
