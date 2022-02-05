import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.less'],
})
export class UserAvatarComponent {
  constructor(private userService: UserService, private authenticationService: AuthenticationService) {}

  logout() {
    return this.authenticationService.logout();
  }

  get user() {
    return this.userService.currentUser;
  }
}
