import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  AuthenticationService,
  AuthEvent,
  AuthResponse,
} from '../authentication/authentication.service';

export interface User {
  _id: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUser: User | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(environment.apiHost + 'token/', { email, password })
      .pipe(tap((val) => this.authService.setAuth(val)));
  }

  getUser(): Observable<User> {
    console.log(this.currentUser);
    if (this.authService.isAuthenticated() && this.currentUser)
      return of(this.currentUser);
    return this.http.get<User>(environment.apiHost + 'tutors/current').pipe(
      tap({
        next: (user) => (this.currentUser = user),
        error: () => (this.currentUser = null),
      })
    );
  }
}
