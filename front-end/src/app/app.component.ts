import { ApplicationRef, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { NotificationService } from '@services/notification/notification.service';
import { UserService } from '@services/user/user.service';
import { filter, map } from 'rxjs/operators';
import { SwUpdate } from '@angular/service-worker';
import { SwUpdateService } from '@services/sw-update/sw-update.service';

/**
 *
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = '';
  subtitle = '';
  showTitle = true;
  isLoading = true;

  /**
   *
   * @param router
   * @param activatedRoute
   * @param titleService
   * @param notificationService
   * @param userService
   * @param sw
   * @param appRef
   */
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    public notificationService: NotificationService,
    private userService: UserService,
    private sw: SwUpdateService,
    private appRef: ApplicationRef
  ) {
    this.sw.checkForUpdates();
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

    this.router.events.subscribe((event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.isLoading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.isLoading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }
}
