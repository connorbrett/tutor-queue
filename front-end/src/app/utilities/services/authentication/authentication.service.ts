import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import { BaseApiService } from '../base-api/base-api.service';
import { NgEventBus } from 'ng-event-bus';
import { EventBus } from '@utilities/interfaces/event/event';

export const ACCESS_TOKEN_LOCALSTORAGE = 'accessToken';
export const REFRESH_TOKEN_LOCALSTORAGE = 'refreshToken';

export interface AuthResponse {
  access: string;
  refresh?: string;
}

export interface AuthEvent {
  isLoggedIn: boolean;
}

/**
 * Auth service, handles login/logout/refresh and storing of credentials.
 *
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private _accessToken: string | null = localStorage.getItem(ACCESS_TOKEN_LOCALSTORAGE);
  private _refreshToken: string | null = localStorage.getItem(REFRESH_TOKEN_LOCALSTORAGE);

  /**
   *
   * @param router
   * @param http
   * @param jwtHelper
   * @param bus
   */
  constructor(
    private router: Router,
    private http: BaseApiService,
    public jwtHelper: JwtHelperService,
    private bus: NgEventBus
  ) {}

  /**
   * Logout flow, force the auth to be null, send logout event and then navigate to login page.
   */
  logout(): void {
    this.setAuth(null);
    this.bus.cast(EventBus.User.get('logout'));
    this.router.navigate(['/login']);
  }

  /**
   * @returns {boolean} If the current access token is valid.
   */
  public isAuthenticated(): boolean {
    // Check whether the token is expired and return
    // true or false
    return !!this.accessToken && !this.jwtHelper.isTokenExpired(this.accessToken);
  }

  /**
   * @returns {boolean} If the current refresh token is valid.
   */
  public hasValidRefreshToken(): boolean {
    // Check whether the token is expired and return
    // true or false
    return !!this.refreshToken && !this.jwtHelper.isTokenExpired(this.refreshToken);
  }

  /**
   * Refresh the current users access token if there is a valid refresh token, otherwise throw an error.
   *
   * @returns {Observable} HttpResponse or Error Observable.
   */
  public refresh(): Observable<unknown> {
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

  /**
   *
   * @param {AuthResponse | null } val Value to set the stored values of auth to be.
   */
  setAuth(val: AuthResponse | null): void {
    if (!val) {
      this.refreshToken = '';
      this.accessToken = '';
    } else {
      if (val.refresh) this.refreshToken = val.refresh;
      if (val.access) this.accessToken = val.access;
    }
  }

  /**
   * @returns {string|null} The current users access token.
   */
  get accessToken(): string | null {
    return this._accessToken;
  }

  /**
   * @param {string|null} val Value to set access token to.
   */
  set accessToken(val: string | null) {
    this._accessToken = val;
    localStorage.setItem(ACCESS_TOKEN_LOCALSTORAGE, val || '');
  }

  /**
   * @returns {string|null} The current users refresh token.
   */
  get refreshToken(): string | null {
    return this._refreshToken;
  }

  /**
   * @param {string|null} val Value to set refresh token to.
   */
  set refreshToken(val: string | null) {
    this._refreshToken = val;
    localStorage.setItem(REFRESH_TOKEN_LOCALSTORAGE, val || '');
  }

  /**
   * @returns {boolean} If the user has both a refresh and an access token.
   */
  get hasToken(): boolean {
    return !!this.accessToken && !!this.refreshToken;
  }
}
