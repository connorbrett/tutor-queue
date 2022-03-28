import { AuthResponse, AuthenticationService } from '../authentication/authentication.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';
import { BaseApiService } from '../base-api/base-api.service';
import { Course } from '../course/course.service';
import { BaseService } from '../base-service/base-service.service';
import { NgEventBus } from 'ng-event-bus';
import { EventBus } from '@utilities/interfaces/event/event';
import { CacheService } from '@services/cache/cache.service';
import { HttpRequestCache } from '@services/cache/cache.decorator';

export interface User {
  _id: string;
  name: string;
  email: string;
  courses: Course[];
  is_coord: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<User> {
  refreshSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  isUserCached = false;

  constructor(
    http: BaseApiService,
    private authService: AuthenticationService,
    private bus: NgEventBus,
    private cache: CacheService
  ) {
    super(http, 'auth/users');
    bus.on(EventBus.User.get('logout')).subscribe(() => {
      this.resetUser();
    });
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>('auth/jwt/create', { email, password }).pipe(
      tap((val) => {
        this.authService.setAuth(val);
        this.getUser().subscribe();
      })
    );
  }

  getUser(): Observable<User | null> {
    if (this.isUserCached) return this.refreshSubject.asObservable().pipe(first());
    return this.http.get<User>('auth/users/me').pipe(
      tap(
        (user: User) => {
          this.isUserCached = true;
          this.refreshSubject.next(user);
        },
        () => this.resetUser()
      )
    );
  }

  resetUser() {
    this.isUserCached = false;
    this.authService.setAuth(null);
    this.refreshSubject.next(null);
  }

  activate(uid: string, token: string) {
    return this.http.post('auth/users/activation', {
      uid,
      token,
    });
  }

  resetPassword(email: string) {
    return this.http.post('auth/users/reset_password', {
      email,
    });
  }

  confirmPasswordReset(uid: string, token: string, new_password: string, re_new_password: string) {
    return this.http.post('auth/users/reset_password_confirm', {
      uid,
      token,
      new_password,
      re_new_password,
    });
  }

  createBulk(file: File) {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<boolean>(`tutors/upload`, form);
  }
}
