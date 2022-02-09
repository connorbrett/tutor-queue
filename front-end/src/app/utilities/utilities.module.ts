import { AuthenticationService } from './services/authentication/authentication.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgEventBus } from 'ng-event-bus';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NavBarComponent],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  providers: [NgEventBus, AuthenticationService],
  exports: [NavBarComponent],
})
export class UtilitiesModule {}
