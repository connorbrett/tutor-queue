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
export class UserService extends BaseService<User>{
  currentUser: User | null = null;
  callCount = 0;

  constructor(http: BaseApiService, private authService: AuthenticationService) {
    super(http, 'auth/users')
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>('auth/jwt/create', { email, password })
      .pipe(tap((val) => this.authService.setAuth(val)));
  }

  getUser(): Observable<User> {
    this.callCount += 1;
    if (this.authService.isAuthenticated() && this.currentUser) return of(this.currentUser);
    return this.http.get<User>('auth/users/me').pipe(
      tap({
        next: (user) => (this.currentUser = user),
      })
    );
  }

  createBulk(file: File) {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<boolean>(`tutors/upload`, form);
  }
}
