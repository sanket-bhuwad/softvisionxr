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
import { AuthRole, AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const requiredRole = (route.data?.['requiredRole'] as AuthRole | undefined) || 'admin';
    return this.checkAccess(state.url, requiredRole);
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree {
    const path = route.path || segments.map((segment) => segment.path).join('/');
    const requiredRole = (route.data?.['requiredRole'] as AuthRole | undefined) || 'admin';
    return this.checkAccess(`/${path}`, requiredRole);
  }

  private checkAccess(returnUrl: string, requiredRole: AuthRole): boolean | UrlTree {
    if (this.authService.isAuthenticated() && this.authService.hasRole(requiredRole)) {
      return true;
    }

    return this.router.createUrlTree(['/login'], {
      queryParams: { returnUrl }
    });
  }
}
