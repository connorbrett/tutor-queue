import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { JwtModule } from '@auth0/angular-jwt';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StudentModule } from './student/student.module';
import { TutorModule } from './tutor/tutor.module';
import { ACCESS_TOKEN_LOCALSTORAGE } from './utilities/services/authentication/authentication.service';

export function tokenGetter() {
  return localStorage.getItem(ACCESS_TOKEN_LOCALSTORAGE);
}
@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    TutorModule,
    StudentModule,
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
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
