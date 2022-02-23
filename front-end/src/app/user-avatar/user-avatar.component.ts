import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { User, UserService } from '@services/user/user.service';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.less'],
})
export class UserAvatarComponent {
  user: User | null = null;
  constructor(private userService: UserService, private authenticationService: AuthenticationService) {
    this.userService.refreshSubject.subscribe((user) => {
      this.user = user;
    });
  }

  logout() {
    return this.authenticationService.logout();
  }
}
