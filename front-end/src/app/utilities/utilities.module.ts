import { AuthGuard } from './guards/auth/auth.guard';
import { AuthenticationService } from './services/authentication/authentication.service';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { CourseService } from './services/course/course.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgEventBus } from 'ng-event-bus';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RefreshInterceptor } from './interceptors/refresh/refresh.interceptor';
import { RequestService } from './services/request/request.service';
import { UserService } from './services/user/user.service';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NavBarComponent],
  imports: [CommonModule, BrowserModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  providers: [
    NgEventBus,
    AuthenticationService,
    AuthGuard,
    RequestService,
    UserService,
    CourseService,
    { provide: HTTP_INTERCEPTORS, useClass: RefreshInterceptor, multi: true },
  ],
  exports: [NavBarComponent],
})
export class UtilitiesModule {}
