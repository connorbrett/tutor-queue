import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import { BaseApiService } from '../base-api/base-api.service';

export const ACCESS_TOKEN_LOCALSTORAGE = 'accessToken';
export const REFRESH_TOKEN_LOCALSTORAGE = 'refreshToken';

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
  private _accessToken: string | null = localStorage.getItem(ACCESS_TOKEN_LOCALSTORAGE);
  private _refreshToken: string | null = localStorage.getItem(REFRESH_TOKEN_LOCALSTORAGE);

  constructor(private router: Router, private http: BaseApiService, public jwtHelper: JwtHelperService) {}

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiHost}/auth/jwt/create/`, { email: username, password }).pipe(
      tap((user) => {
        this.setAuth(user);
      })
    );
  }

  logout() {
    this.setAuth(null);
    this.router.navigate(['/login']);
  }

  public isAuthenticated(): boolean {
    // Check whether the token is expired and return
    // true or false
    return !!this.accessToken && !this.jwtHelper.isTokenExpired(this.accessToken);
  }

  public hasValidRefreshToken(): boolean {
    // Check whether the token is expired and return
    // true or false
    return !!this.refreshToken && !this.jwtHelper.isTokenExpired(this.refreshToken);
  }

  public refresh() {
    if (this.refreshToken) {
      return this.http
        .post<AuthResponse>(`auth/jwt/refresh`, {
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
      this.refreshToken = '';
      this.accessToken = '';
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
    localStorage.setItem(ACCESS_TOKEN_LOCALSTORAGE, val!);
  }

  get refreshToken() {
    return this._refreshToken;
  }
  set refreshToken(val) {
    this._refreshToken = val;
    localStorage.setItem(REFRESH_TOKEN_LOCALSTORAGE, val!);
  }

  get hasToken() {
    return this.accessToken && this.refreshToken;
  }
}
