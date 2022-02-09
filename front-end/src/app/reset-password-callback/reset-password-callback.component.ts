import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { verifySameAsValidator } from '@coord/create-tutor/create-tutor.component';
import { UserService } from '@services/user/user.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-reset-password-callback',
  templateUrl: './reset-password-callback.component.html',
  styleUrls: ['./reset-password-callback.component.less'],
})
export class ResetPasswordCallbackComponent implements OnInit {
  wasValidated = false;
  uid = '';
  token = '';

  requestForm = this.formBuilder.group({
    password: new FormControl('', Validators.required),
    re_password: new FormControl('', [Validators.required, verifySameAsValidator('password')]),
  });

  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const map = this.route.snapshot.paramMap;
    this.uid = map.get('uid')!;
    this.token = map.get('token')!;
  }

  onSubmit() {
    this.wasValidated = true;
    if (!this.requestForm.valid) return;
    const { password, re_new_password } = this.requestForm.value;
    this.userService.confirmPasswordReset(this.uid, this.token, password, re_new_password).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err: Error) => {
        if (err instanceof HttpErrorResponse) {
          this.error = JSON.stringify(err.error);
        }
      },
    });
  }

  get password() {
    return this.requestForm.get('password');
  }

  get re_password() {
    return this.requestForm.get('re_password');
  }
}
