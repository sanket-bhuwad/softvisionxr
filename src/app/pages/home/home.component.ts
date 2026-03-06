import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        query('.animate-item', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(100, [
            animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('800ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  services = [
    {
      icon: '💻',
      title: 'Web & Software Development',
      description: 'Custom web applications and software solutions tailored to your business needs.'
    },
    {
      icon: '🤖',
      title: 'AI & Automation Solutions',
      description: 'Intelligent automation and AI-powered systems to streamline your operations.'
    },
    {
      icon: '🥽',
      title: 'AR / VR / XR Development',
      description: 'Immersive experiences with cutting-edge extended reality technologies.'
    },
    {
      icon: '📱',
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications for iOS and Android.'
    },
    {
      icon: '☁️',
      title: 'Cloud & Cybersecurity',
      description: 'Secure cloud infrastructure and comprehensive cybersecurity solutions.'
    }
  ];

  solutions = [
    {
      icon: '🚀',
      title: 'Enterprise Solutions',
      description: 'Scalable enterprise-grade software solutions for large organizations.'
    },
    {
      icon: '🎯',
      title: 'Digital Transformation',
      description: 'Complete digital transformation strategies to modernize your business.'
    },
    {
      icon: '🔐',
      title: 'Security Solutions',
      description: 'Advanced security protocols and systems to protect your digital assets.'
    },
    {
      icon: '📊',
      title: 'Analytics & Insights',
      description: 'Data-driven insights and analytics platforms for informed decision-making.'
    }
  ];

  features = [
    {
      icon: '✨',
      title: 'Innovative Technology',
      description: 'Cutting-edge tools and frameworks for modern solutions.'
    },
    {
      icon: '👥',
      title: 'Expert Engineers',
      description: 'Experienced team of developers and technology specialists.'
    },
    {
      icon: '📈',
      title: 'Scalable Solutions',
      description: 'Solutions that grow with your business needs.'
    },
    {
      icon: '🛡️',
      title: 'Reliable Support',
      description: '24/7 support and maintenance for peace of mind.'
    }
  ];

  testimonials = [
    {
      name: 'John Smith',
      role: 'CEO, TechCorp',
      content: 'SOFTVISIONXR transformed our digital infrastructure with innovative solutions that exceeded our expectations.',
      rating: 5
    },
    {
      name: 'Sarah Johnson',
      role: 'CTO, InnovateLabs',
      content: 'Their expertise in XR technology helped us create immersive experiences that captivated our users.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Director, DigitalFirst',
      content: 'Professional, reliable, and innovative. SOFTVISIONXR is our go-to partner for all tech solutions.',
      rating: 5
    }
  ];

  currentTestimonial = 0;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.startTestimonialRotation();
  }

  startTestimonialRotation(): void {
    setInterval(() => {
      this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
    }, 5000);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
