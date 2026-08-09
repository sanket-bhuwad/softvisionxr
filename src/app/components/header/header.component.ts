import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

interface MenuItem {
  path: string;
  label: string;
  fragment?: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isScrolled = false;
  isMenuOpen = false;

  menuItems: MenuItem[] = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/products', label: 'Products' },
    { path: '/', fragment: 'technology', label: 'Technology' },
    { path: '/', fragment: 'team', label: 'Team' },
    { path: '/', fragment: 'goals', label: 'Goals' },
    { path: '/contact', label: 'Contact' }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/']);
  }
}
