import { AuthenticationService } from '@services/authentication/authentication.service';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent {
  wasValidated = false;
  error = '';
  loginForm = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (this.authService.isAuthenticated())
      this.router.navigate([this.route.snapshot.queryParamMap.get('returnUrl') || '/tutor']);
  }

  onSubmit() {
    this.wasValidated = true;
    if (!this.loginForm.valid) return;
    const { email, password } = this.loginForm.value;
    this.userService.login(email, password).subscribe({
      next: () => this.router.navigate([this.route.snapshot.queryParamMap.get('returnUrl') || '/tutor']),
      error: (err: HttpErrorResponse) => (this.error = err.error ? err.error.detail : err),
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
