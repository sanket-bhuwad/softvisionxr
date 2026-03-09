import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isScrolled = false;
  isMenuOpen = false;

  menuItems = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/solutions', label: 'Solutions' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' }
  ];

  constructor() {}

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
}
