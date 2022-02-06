import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UserService } from '@services/user/user.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-activate-user',
  templateUrl: './activate-user.component.html',
  styleUrls: ['./activate-user.component.less'],
})
export class ActivateUserComponent implements OnInit {
  isLoading = true;
  error = '';
  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(switchMap((params: ParamMap) => this.userService.activate(params.get('uid')!, params.get('token')!)))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/login']);
        },
        error: (err: Error) => {
          this.isLoading = false;
          if (err instanceof HttpErrorResponse) {
            switch (err.status) {
              case 403:
                this.error = 'Account has already been activated.';
                setTimeout(() => this.router.navigate(['/login']), 2000);
                break;
              case 400:
                this.error = JSON.stringify(err.error);
                break;
            }
          }
        },
      });
  }
}
