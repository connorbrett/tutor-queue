import { AuthResponse, AuthenticationService } from '../authentication/authentication.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { BaseApiService } from '../base-api/base-api.service';
import { Course } from '../course/course.service';
import { BaseService } from '../base-service/base-service.service';
import { NgEventBus } from 'ng-event-bus';
import { EventBus } from '@utilities/interfaces/event/event';
import { CacheService } from '@services/cache/cache.service';
import { HttpResponse } from '@angular/common/http';

export interface User {
  _id: string;
  name: string;
  email: string;
  courses: Course[];
  is_coord: boolean;
}

/**
 * Handle API requests to the /api/auth/users endpoint.
 */
@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<User> {
  refreshSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  isUserCached = false;

  /**
   *
   * @param http Base Http, passed to super class.
   * @param authService Service to abstract authentication methods.
   * @param bus Event bus.
   */
  constructor(http: BaseApiService, private authService: AuthenticationService, private bus: NgEventBus) {
    super(http, 'auth/users');
    bus.on(EventBus.User.get('logout')).subscribe(() => {
      this.resetUser();
    });
  }

  /**
   * Login with @param email and @param password.
   *
   * @param {string} email Pmail to login as.
   * @param {string} password Password to login as.
   * @returns {HttpResponse} HttpResponse.
   */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('auth/jwt/create', { email, password }).pipe(
      tap((val) => {
        this.authService.setAuth(val);
        this.getUser().subscribe();
      })
    );
  }

  /**
   * Get the current logged in user. Grabs cached copy if available.
   *
   * @returns {Observable<User | null>} Returns current user.
   */
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

  /**
   * Reset the user subject and reset any auth credentials stored for the user.
   */
  resetUser(): void {
    this.isUserCached = false;
    this.authService.setAuth(null);
    this.refreshSubject.next(null);
  }

  /**
   * Activate the current user, part of a post account setup flow.
   *
   * @param {string} uid User's id hash, pulled from email.
   * @param {string} token User's specific token, pulled from email.
   * @returns {Observable} HttpResponse.
   */
  activate(uid: string, token: string): Observable<unknown> {
    return this.http.post('auth/users/activation', {
      uid,
      token,
    });
  }

  /**
   * Reset the current users password. Starts a server flow to send an email.
   *
   * @param {string} email Email of the user to reset the password of.
   * @returns {Observable} HttpResponse.
   */
  resetPassword(email: string): Observable<unknown> {
    return this.http.post('auth/users/reset_password', {
      email,
    });
  }

  /**
   * Final part of the reset token flow, sends params from email and user entered new password to server.
   *
   * @param {string} uid User id hash.
   * @param {string} token Server token, from email.
   * @param {string} new_password User entered new password.
   * @param {string} re_new_password User entered password confirmation, validated server side as well.
   * @returns {Observable} HttpResponse.
   */
  confirmPasswordReset(uid: string, token: string, new_password: string, re_new_password: string): Observable<unknown> {
    return this.http.post('auth/users/reset_password_confirm', {
      uid,
      token,
      new_password,
      re_new_password,
    });
  }

  /**
   * Create tutors bulk, through a CSV upload.
   *
   * @todo Populate the backend creation for this class.
   * @param {File} file CSV file to send to server to create tutors from.
   * @returns {Observable} HttpResponse.
   */
  createBulk(file: File): Observable<unknown> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<boolean>(`tutors/upload`, form);
  }
}
