import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgEventBus } from 'ng-event-bus';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RefreshInterceptor } from './interceptors/refresh/refresh.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from './services/authentication/authentication.service';
import { AuthGuard } from './guards/auth/auth.guard';
import { RequestService } from './services/request/request.service';
import { UserService } from './services/user/user.service';
import { CourseService } from './services/course/course.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, BrowserModule, ReactiveFormsModule, HttpClientModule],
  providers: [
    NgEventBus,
    AuthenticationService,
    AuthGuard,
    RequestService,
    UserService,
    CourseService,
    { provide: HTTP_INTERCEPTORS, useClass: RefreshInterceptor, multi: true },
  ],
  exports: [],
})
export class UtilitiesModule {}
