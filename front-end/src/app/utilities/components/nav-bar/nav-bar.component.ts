import { Component, Input } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';

const TRAILING_BACKSLASH = /\/$/gm;

export interface NavItem {
  path: string;
  label: string;
  children?: NavItem[];
  active?: boolean;
}

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.less'],
})
export class NavBarComponent {
  @Input() routes: NavItem[] = [];
  baseSegments: string[];

  constructor(private router: Router, activatedRoute: ActivatedRoute) {
    this.baseSegments = router.url.substring(1).split('/');
  }

  getPath(...elems: string[]) {
    return [...this.baseSegments, ...elems];
  }
}
