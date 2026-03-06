import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isScrolled = false;
  isMenuOpen = false;
  currentRoute = '';

  menuItems = [
    { path: '/home', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/solutions', label: 'Solutions' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' }
  ];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
        this.isMenuOpen = false;
      });
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url;
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  isActive(path: string): boolean {
    return this.currentRoute === path || (path === '/home' && this.currentRoute === '/');
  }
}
