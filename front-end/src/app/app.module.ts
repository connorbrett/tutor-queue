import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { StudentQueueComponent } from './student-queue/student-queue.component';
import { RequestFormComponent } from './request-form/request-form.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseApiInterceptor } from './base-api.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { ErrorInterceptor } from './error.interceptor';
import { RefreshInterceptor } from './refresh.interceptor';

export function tokenGetter() {
  return localStorage.getItem('accessToken');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    StudentQueueComponent,
    RequestFormComponent,
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
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RefreshInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: BaseApiInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
