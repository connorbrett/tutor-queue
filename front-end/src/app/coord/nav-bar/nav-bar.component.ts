import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-coord-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.less'],
})
export class NavBarComponent {
  routes = [
    { path: '/tutor', label: 'Dashboard' },
    { path: 'tutors', label: 'Tutors' },
    { path: 'schedule', label: 'Schedule' },
  ];
  constructor() {}
}
