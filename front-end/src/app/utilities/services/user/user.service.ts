import { AuthEvent, AuthResponse, AuthenticationService } from '../authentication/authentication.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Pageable } from '../base-api/paging.model';
import { BaseApiService } from '../base-api/base-api.service';
import { Course } from '../course/course.service';
import { BaseService } from '../base-service/base-service.service';

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
  currentUser: User | null = null;

  constructor(http: BaseApiService, private authService: AuthenticationService) {
    super(http, 'auth/users');
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>('auth/jwt/create', { email, password })
      .pipe(tap((val) => this.authService.setAuth(val)));
  }

  getUser(): Observable<User> {
    if (this.authService.isAuthenticated() && this.currentUser) return of(this.currentUser);
    return this.http.get<User>('auth/users/me').pipe(
      tap({
        next: (user) => (this.currentUser = user),
      })
    );
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
