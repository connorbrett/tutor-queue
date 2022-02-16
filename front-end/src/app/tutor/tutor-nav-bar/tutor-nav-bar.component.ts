import { Component } from '@angular/core';

@Component({
  selector: 'app-tutor-nav-bar',
  templateUrl: './tutor-nav-bar.component.html',
  styleUrls: ['./tutor-nav-bar.component.less'],
})
export class TutorNavBarComponent {
  routes = [
    // For true relative base url, ie /tutor, you need to do ./
    { path: 'dashboard', label: 'Dashboard' },
    { path: 'queue', label: 'Queue' },
  ];
}
