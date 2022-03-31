import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { User, UserService } from '@services/user/user.service';
import { tap } from 'rxjs/operators';

/**
 * User icon/Login Button in header.
 */
@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.less'],
})
export class UserAvatarComponent implements OnInit {
  user: User | null = null;

  /**
   *
   * @param userService
   * @param authenticationService
   */
  constructor(private userService: UserService, private authenticationService: AuthenticationService) {
    this.userService.refreshSubject.subscribe((user) => {
      this.user = user;
    });
  }

  /**
   * Get the current user on startup.
   */
  ngOnInit(): void {
    this.userService
      .getUser()
      .pipe(
        tap((user) => {
          this.user = user;
        })
      )
      .subscribe();
  }

  /**
   * Logout of the application.
   */
  logout(): void {
    this.authenticationService.logout();
  }
}
