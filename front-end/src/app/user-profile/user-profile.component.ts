import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserService } from '@services/user/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.less'],
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  isLoading = true;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getUser().subscribe((user: User) => {
      this.isLoading = false;
      if (!user) {
        this.router.navigate(['/unauthorized']);
      }
      this.user = user;
    });
  }
}
