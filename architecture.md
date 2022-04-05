# Overview
## Docker Setup
Consider two requests, one to the frontend and one to the backend.

### Frontend Request
The frontend request will take the below path through the docker containers.

1. Hits the reverse proxy, dubbed the `proxy` container, which will redirect any traffic that isn't supposed to go to `api/` to the frontend.
    1. This routing is to allow the front end to return the home page for any request that isn't directly to the API. This allows for custom error pages and handling of custom routes inside of the SPA.
2. Hits the nginx file server in the frontend docker image.
    1. The file server allows the serving of custom static content from angular while also allowing for default serving of index.html is unable to find the correct file to server, ie if trying to serve a custom route.

3. Loads the file from the frontend file server and sends back.

### Backend Request
The backend request will take the below path through the docker containers.
1. Hits the reverse proxy and because it matches `api/` it will be directed to the server docker container.
2. Is handled by the server.

## Front End
### Routing
Each base route in the application, ie `/tutors/`, is a separate route in the `app-routing.module.ts` file. You can copy the syntax,

```
{
    path: 'coord',\
    canActivate: [AuthGuard, AdminAuthGuard],
    canActivateChild: [AuthGuard, AdminAuthGuard],
    loadChildren: () => import('./coord/coord.module').then((m) => m.CoordModule),
}
```
to add a new route.

Then add a new module with its own routing.

*_Caveat_: Routing is handled in order, ie if two routes match the current route, the first route will be the one the user sees.

## Back End
### API Docs
You can view the API docs at `api/swagger`, this documents all of the current endpoints and objects available for usage.

This project uses DRF (Django Rest Framework) for serving objects through the ORM, to add objects please refer to that documentation as it describes best practices for a REST API.
