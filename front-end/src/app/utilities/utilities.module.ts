import { AuthenticationService } from './services/authentication/authentication.service';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgEventBus } from 'ng-event-bus';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RefreshInterceptor } from './interceptors/refresh/refresh.interceptor';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@NgModule({
  declarations: [NavBarComponent],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  providers: [NgEventBus, AuthenticationService],
  exports: [NavBarComponent],
})
export class UtilitiesModule {}
