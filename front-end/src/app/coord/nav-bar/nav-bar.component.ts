import { Component } from '@angular/core';

@Component({
  selector: 'app-coord-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.less'],
})
export class NavBarComponent {
  routes = [
    { path: 'tutors', label: 'Tutors' },
    { path: 'courses', label: 'Courses' },
    { path: 'schedule', label: 'Schedule' },
  ];
}
