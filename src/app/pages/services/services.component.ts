import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  services = [
    {
      icon: '💻',
      title: 'Web & Software Development',
      description: 'Custom web applications and software solutions tailored to business needs. We focus on scalable architecture, maintainable code, and practical delivery.',
      features: [
        'Business Web Applications',
        'Custom Software Solutions',
        'Enterprise Applications',
        'Admin Dashboards',
        'Management Systems',
        'API-Driven Applications',
        'Full-Stack Applications',
        'Responsive Web Platforms'
      ]
    },
    {
      icon: '📱',
      title: 'Mobile App Development',
      description: 'Modern mobile applications focused on usability, performance, and scalable architecture across the devices your users rely on.',
      features: [
        'Business Mobile Applications',
        'Customer-Facing Apps',
        'Management Applications',
        'Android Applications',
        'Cross-Platform Apps Where Appropriate',
        'API-Integrated Mobile Apps'
      ]
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
