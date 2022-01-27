import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit {
  wasValidated = false;
  error = '';
  loginForm = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthenticationService
  ) {
    if (this.authService.isAuthenticated()) window.location.href = '/tutor';
  }

  ngOnInit(): void {}

  onSubmit() {
    this.wasValidated = true;
    if (!this.loginForm.valid) return;
    const { email, password } = this.loginForm.value;
    this.userService.login(email, password).subscribe({
      next: () => (window.location.href = '/tutor'),
      error: (err: HttpErrorResponse) => (this.error = err.error.detail),
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
