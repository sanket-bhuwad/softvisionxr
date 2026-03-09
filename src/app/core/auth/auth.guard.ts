import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    return this.checkAccess(state.url);
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree {
    const path = route.path || segments.map((segment) => segment.path).join('/');
    return this.checkAccess(`/${path}`);
  }

  private checkAccess(returnUrl: string): boolean | UrlTree {
    if (this.authService.isAuthenticated() && this.authService.hasRole('admin')) {
      return true;
    }

    return this.router.createUrlTree(['/login'], {
      queryParams: { returnUrl }
    });
  }
}
