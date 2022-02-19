import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { NotificationService } from '@services/notification/notification.service';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'tutor-queue';
  subtitle = '';
  showTitle = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    public notificationService: NotificationService
  ) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while (child) {
            if (child.firstChild) {
              child = child.firstChild;
            } else if (child.snapshot.data) {
              return child.snapshot.data;
            } else {
              return null;
            }
          }
          return null;
        })
      )
      .subscribe((data: any) => {
        if (data) {
          const { title, subtitle, showTitle } = data;
          this.showTitle = showTitle === undefined ? true : showTitle;
          this.title = title;
          this.subtitle = subtitle;
          this.titleService.setTitle(title + ' | Tutor Center');
        }
      });
  }
}
