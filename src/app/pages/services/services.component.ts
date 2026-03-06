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
      description: 'Custom web applications and software solutions tailored to your business needs. We build scalable, high-performance applications using the latest technologies.',
      features: [
        'Custom Web Applications',
        'Progressive Web Apps (PWA)',
        'API Development & Integration',
        'Legacy System Modernization'
      ]
    },
    {
      icon: '🤖',
      title: 'AI & Automation Solutions',
      description: 'Intelligent automation and AI-powered systems to streamline your operations and unlock new possibilities.',
      features: [
        'Machine Learning Models',
        'Process Automation',
        'Chatbots & Virtual Assistants',
        'Predictive Analytics'
      ]
    },
    {
      icon: '🥽',
      title: 'AR / VR / XR Development',
      description: 'Immersive experiences with cutting-edge extended reality technologies that engage and captivate users.',
      features: [
        'Virtual Reality Applications',
        'Augmented Reality Solutions',
        'Mixed Reality Experiences',
        'XR Training & Simulations'
      ]
    },
    {
      icon: '📱',
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications for iOS and Android that deliver exceptional user experiences.',
      features: [
        'iOS & Android Native Apps',
        'Cross-Platform Solutions',
        'Mobile UI/UX Design',
        'App Store Optimization'
      ]
    },
    {
      icon: '☁️',
      title: 'Cloud & Cybersecurity',
      description: 'Secure cloud infrastructure and comprehensive cybersecurity solutions to protect your digital assets.',
      features: [
        'Cloud Migration & Strategy',
        'Security Audits & Assessments',
        'Data Protection & Encryption',
        '24/7 Security Monitoring'
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
