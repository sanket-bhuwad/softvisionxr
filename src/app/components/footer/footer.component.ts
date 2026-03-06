import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentYear = new Date().getFullYear();

  socialLinks = [
    { icon: 'linkedin', url: '#' },
    { icon: 'twitter', url: '#' },
    { icon: 'facebook', url: '#' },
    { icon: 'github', url: '#' }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
