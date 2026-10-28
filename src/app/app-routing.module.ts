import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreloadAllModules } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'SOFTVISIONXR | Web & Software Development | Mobile App Development',
      description: 'SOFTVISIONXR builds modern web applications, software solutions and mobile applications with a focus on quality, performance and scalable architecture.'
    },
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule)
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'services',
    data: {
      title: 'Services | SOFTVISIONXR',
      description: 'Discover SOFTVISIONXR services focused on web and software development, mobile app development, and practical product engineering.'
    },
    loadChildren: () =>
      import('./pages/services/services.module').then((m) => m.ServicesModule)
  },
  {
    path: 'products',
    data: {
      title: 'Products | SOFTVISIONXR',
      description: 'See the product ideas, internal projects and software concepts SOFTVISIONXR is building or planning for the future.'
    },
    loadChildren: () =>
      import('./pages/solutions/solutions.module').then((m) => m.SolutionsModule)
  },
  {
    path: 'solutions',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  {
    path: 'about',
    data: {
      title: 'About Us | SOFTVISIONXR',
      description: 'Meet SOFTVISIONXR, a growing technology startup focused on building practical software products and digital experiences.'
    },
    loadChildren: () =>
      import('./pages/about/about.module').then((m) => m.AboutModule)
  },
  {
    path: 'contact',
    data: {
      title: 'Contact | SOFTVISIONXR',
      description: 'Contact SOFTVISIONXR to discuss web development, software engineering, mobile apps, and product development requirements.'
    },
    loadChildren: () =>
      import('./pages/contact/contact.module').then((m) => m.ContactModule)
  },
  {
    path: 'login',
    data: {
      title: 'Login | SOFTVISIONXR',
      description: 'Admin login page for secured route access and dashboard management.'
    },
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule)
  },
  {
    path: 'admin',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    data: {
      requiredRole: 'admin',
      title: 'Admin Dashboard | SOFTVISIONXR',
      description: 'Protected admin dashboard for internal use.'
    },
    loadChildren: () =>
      import('./pages/admin/admin.module').then((m) => m.AdminModule)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 88],
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
