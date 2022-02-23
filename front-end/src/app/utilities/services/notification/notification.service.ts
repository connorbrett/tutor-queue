import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { BaseApiService } from '@services/base-api/base-api.service';
import { BaseService } from '@services/base-service/base-service.service';
import { User, UserService } from '@services/user/user.service';
import { VAPID_PUBLIC_KEY } from '@utilities/const';
import { throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NotificationService extends BaseService<User> {
  constructor(http: BaseApiService, private userService: UserService, private swPush: SwPush) {
    super(http, 'webpush');
    if (window.Notification) {
      const notificationStatus = window.Notification.permission;
      console.log(notificationStatus);
      if (notificationStatus === 'default') {
        this.userService.getUser().subscribe(() => {
          this.swPush
            .requestSubscription({
              serverPublicKey: VAPID_PUBLIC_KEY,
            })
            .then((sub) => {
              this.addPushSubscriber(sub).subscribe();
            })
            .catch((err) => console.error('Could not subscribe to notifications', err));
        });
      }
    }
  }

  addPushSubscriber(subscription: PushSubscription) {
    return this.updatePushSubscriber('subscribe', subscription);
  }

  updatePushSubscriber(
    status: string,
    subscription: PushSubscription,
    options?: {
      group?: string;
    }
  ) {
    return this.userService.getUser().pipe(
      switchMap((currentUser: User) => {
        if (!currentUser) return throwError(new Error('user must be authenticated'));
        const browser = (navigator.userAgent.match(/(firefox|msie|chrome|safari|trident)/gi) || [])[0].toLowerCase();
        return this.http.post(this.baseEndpoint, {
          status_type: status,
          subscription: subscription.toJSON(),
          browser,
          user_agent: navigator.userAgent,
          ...options,
        });
      })
    );
  }
}
