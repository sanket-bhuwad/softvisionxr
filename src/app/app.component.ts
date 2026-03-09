import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SOFTVISIONXR';
  private readonly siteUrl = environment.siteUrl;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const seo = this.getCurrentSeoData();
        const currentPath = this.router.url || '/home';
        const url = `${this.siteUrl}${currentPath}`;

        this.titleService.setTitle(seo.title);
        this.metaService.updateTag({ name: 'description', content: seo.description });
        this.metaService.updateTag({ property: 'og:title', content: seo.title });
        this.metaService.updateTag({ property: 'og:description', content: seo.description });
        this.metaService.updateTag({ property: 'og:url', content: url });
        this.metaService.updateTag({ name: 'twitter:title', content: seo.title });
        this.metaService.updateTag({ name: 'twitter:description', content: seo.description });

        this.setCanonicalUrl(url);
      });
  }

  private getCurrentSeoData(): { title: string; description: string } {
    let route: ActivatedRoute | null = this.activatedRoute;
    let title = 'SOFTVISIONXR | Future-Ready Digital Solutions';
    let description = 'SOFTVISIONXR delivers modern web, AI, XR, mobile, and cloud engineering services.';

    while (route) {
      if (route.snapshot.data['title']) {
        title = route.snapshot.data['title'];
      }

      if (route.snapshot.data['description']) {
        description = route.snapshot.data['description'];
      }

      route = route.firstChild;
    }

    return { title, description };
  }

  private setCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");

    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }
}
