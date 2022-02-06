import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.less'],
})
export class ResetPasswordComponent {
  wasValidated = false;
  error = '';
  loginForm = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  wasReset = false;

  constructor(private formBuilder: FormBuilder, private userService: UserService) {}

  onSubmit() {
    this.wasValidated = true;
    if (!this.loginForm.valid) return;
    const { email } = this.loginForm.value;
    this.userService.resetPassword(email).subscribe({
      next: () => {
        this.wasReset = true;
      },
      error: (err: HttpErrorResponse) => (this.error = err.error ? err.error.detail : err),
    });
  }

  get email() {
    return this.loginForm.get('email');
  }
}
