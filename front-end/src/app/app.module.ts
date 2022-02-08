import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { ACCESS_TOKEN_LOCALSTORAGE } from './utilities/services/authentication/authentication.service';
import { RefreshInterceptor } from '@utilities/interceptors/refresh/refresh.interceptor';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ActivateUserComponent } from './activate-user/activate-user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ResetPasswordCallbackComponent } from './reset-password-callback/reset-password-callback.component';
import { HttpErrorInterceptor } from '@utilities/interceptors/http-error/http-error.interceptor';
import { GenericComponent } from './error/error-pages/generic/generic.component';
import { ErrorHandlerService } from './error/error-handler/error-handler.service';
import { ThrottleComponent } from './error/error-pages/throttle/throttle.component';

export function tokenGetter() {
  return localStorage.getItem(ACCESS_TOKEN_LOCALSTORAGE);
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserAvatarComponent,
    ResetPasswordComponent,
    ActivateUserComponent,
    UserProfileComponent,
    ResetPasswordCallbackComponent,
    GenericComponent,
    ThrottleComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:8000'],
        authScheme: 'JWT ',
      },
    }),
  ],
  providers: [
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: HTTP_INTERCEPTORS, useClass: RefreshInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
