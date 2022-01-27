import { AuthenticationService } from '@utilities/services/authentication/authentication.service';

export function appInitializer(authenticationService: AuthenticationService) {
  return () =>
    new Promise((resolve) => {
      if (authenticationService.hasToken) {
        // attempt to refresh token on app start up to auto authenticate
        authenticationService.refresh().subscribe({
          next: (val) => resolve(val),
        });
      }
    });
}
