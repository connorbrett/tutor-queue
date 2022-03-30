import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { User, UserService } from '@services/user/user.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.less'],
})
export class UserAvatarComponent implements OnInit {
  user: User | null = null;
  constructor(private userService: UserService, private authenticationService: AuthenticationService) {
    this.userService.refreshSubject.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit() {
    this.userService
      .getUser()
      .pipe(
        tap((user) => {
          this.user = user;
        })
      )
      .subscribe();
  }

  logout() {
    return this.authenticationService.logout();
  }
}
