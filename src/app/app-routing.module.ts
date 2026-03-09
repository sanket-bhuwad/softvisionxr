import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    data: {
      title: 'SOFTVISIONXR | Future-Ready Digital Solutions',
      description: 'Explore SOFTVISIONXR services in web development, AI, XR, mobile, and cloud solutions.'
    },
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule)
  },
  {
    path: 'services',
    data: {
      title: 'Services | SOFTVISIONXR',
      description: 'Discover end-to-end services including software engineering, AI automation, XR experiences, and cloud architecture.'
    },
    loadChildren: () =>
      import('./pages/services/services.module').then((m) => m.ServicesModule)
  },
  {
    path: 'solutions',
    data: {
      title: 'Solutions | SOFTVISIONXR',
      description: 'See industry-focused digital solutions designed to improve scale, performance, and business growth.'
    },
    loadChildren: () =>
      import('./pages/solutions/solutions.module').then((m) => m.SolutionsModule)
  },
  {
    path: 'about',
    data: {
      title: 'About Us | SOFTVISIONXR',
      description: 'Meet SOFTVISIONXR, a technology-driven team building modern digital products and innovation-led platforms.'
    },
    loadChildren: () =>
      import('./pages/about/about.module').then((m) => m.AboutModule)
  },
  {
    path: 'contact',
    data: {
      title: 'Contact | SOFTVISIONXR',
      description: 'Contact SOFTVISIONXR to discuss your project, technology roadmap, and product development requirements.'
    },
    loadChildren: () =>
      import('./pages/contact/contact.module').then((m) => m.ContactModule)
  },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
