import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../user/user.service';

export interface AuthResponse {
  access: string;
  refresh?: string;
}

export interface AuthEvent {
  isLoggedIn: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private _accessToken: string | null = localStorage.getItem('accessToken');
  private _refreshToken: string | null = localStorage.getItem('refreshToken');

  private refreshTokenTimeout: ReturnType<typeof setTimeout> | null = null;

  public lastRefreshAttempt: Date | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    public jwtHelper: JwtHelperService
  ) {}

  login(username: string, password: string) {
    return this.http
      .post<any>(`${environment.apiHost}/token/`, { email: username, password })
      .pipe(
        tap((user) => {
          this.setAuth(user);
          this.startRefreshTokenTimer();
        })
      );
  }

  logout() {
    this.stopRefreshTokenTimer();
    this.setAuth(null);
    this.router.navigate(['/login']);
  }

  // helper methods

  private startRefreshTokenTimer() {
    const expires = this.jwtHelper.getTokenExpirationDate(this.accessToken!);
    if (expires) {
      const timeout = expires.getTime() - Date.now() - 60 * 1000;
      this.refreshTokenTimeout = setTimeout(
        () => this.refresh().subscribe(),
        timeout
      );
    }
  }

  private stopRefreshTokenTimer() {
    if (this.refreshTokenTimeout) clearTimeout(this.refreshTokenTimeout);
  }

  public isAuthenticated(): boolean {
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(this.accessToken!);
  }

  public hasValidRefreshToken(): boolean {
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(this.refreshToken!);
  }

  public refresh() {
    if (this.refreshToken && this.hasEnoughTimePassedSinceLastAttempt) {
      this.lastRefreshAttempt = new Date();
      return this.http
        .post<AuthResponse>(`${environment.apiHost}token/refresh/`, {
          refresh: this.refreshToken,
        })
        .pipe(
          tap({
            next: (val: AuthResponse) => this.setAuth(val),
          })
        );
    } else {
      return throwError(new Error('No refresh token.'));
    }
  }

  setAuth(val: AuthResponse | null) {
    if (!val) {
      this.refreshToken = null;
      this.accessToken = null;
    } else {
      if (val.refresh) this.refreshToken = val.refresh;
      if (val.access) this.accessToken = val.access;
    }
  }

  get accessToken() {
    return this._accessToken;
  }
  set accessToken(val) {
    this._accessToken = val;
    localStorage.setItem('accessToken', val!);
  }

  get refreshToken() {
    return this._refreshToken;
  }
  set refreshToken(val) {
    this._refreshToken = val;
    localStorage.setItem('refreshToken', val!);
  }

  get hasEnoughTimePassedSinceLastAttempt() {
    if (this.lastRefreshAttempt == null) return true;
    return new Date().getTime() - this.lastRefreshAttempt.getTime() > 10000;
  }
}
