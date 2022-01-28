import { AuthEvent, AuthResponse, AuthenticationService } from '../authentication/authentication.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Pageable } from '../request/request.service';

export interface User {
  _id: string;
  name: string;
  email: string;
  courses: string;
  is_coord: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUser: User | null = null;
  callCount = 0;

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(environment.apiHost + 'token/', { email, password })
      .pipe(tap((val) => this.authService.setAuth(val)));
  }

  getUser(): Observable<User> {
    this.callCount += 1;
    if (this.authService.isAuthenticated() && this.currentUser) return of(this.currentUser);
    return this.http.get<User>(environment.apiHost + 'tutors/current').pipe(
      tap({
        next: (user) => (this.currentUser = user),
      })
    );
  }

  listTutors(): Observable<User[]> {
    return this.http.get<Pageable<User>>(`${environment.apiHost}tutors/`).pipe(map((val) => val.results));
  }
}
