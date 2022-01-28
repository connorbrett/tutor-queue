import { Component, OnInit } from '@angular/core';
import { UserService } from '@utilities/services/user/user.service';

const coordRoutes = [{ path: '/coord/tutors', label: 'Coord Interface' }];

@Component({
  selector: 'app-tutor-nav-bar',
  templateUrl: './tutor-nav-bar.component.html',
  styleUrls: ['./tutor-nav-bar.component.less'],
})
export class TutorNavBarComponent implements OnInit {
  routes = [
    // For true relative base url, ie /tutor, you need to do ./
    { path: 'dashboard', label: 'Dashboard' },
    { path: 'queue', label: 'Queue' },
  ];

  constructor(private userService: UserService) {}

  ngOnInit() {
    if (this.userService.currentUser?.is_coord) {
      this.routes.push(...coordRoutes);
    }
  }
}
