import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-solutions',
  templateUrl: './solutions.component.html',
  styleUrls: ['./solutions.component.scss']
})
export class SolutionsComponent implements OnInit {
  solutions = [
    {
      icon: '🚀',
      title: 'Enterprise Solutions',
      description: 'Scalable enterprise-grade software solutions designed for large organizations with complex requirements.',
      details: 'Our enterprise solutions are built to handle high-volume transactions, integrate with existing systems, and scale as your business grows.'
    },
    {
      icon: '🎯',
      title: 'Digital Transformation',
      description: 'Complete digital transformation strategies to modernize your business operations and improve efficiency.',
      details: 'We help organizations transition to digital-first operations through strategic planning, technology implementation, and change management.'
    },
    {
      icon: '🔐',
      title: 'Security Solutions',
      description: 'Advanced security protocols and systems to protect your digital assets and ensure compliance.',
      details: 'Comprehensive security solutions including threat detection, data encryption, access control, and regulatory compliance.'
    },
    {
      icon: '📊',
      title: 'Analytics & Insights',
      description: 'Data-driven insights and analytics platforms for informed decision-making and business intelligence.',
      details: 'Transform your data into actionable insights with our advanced analytics platforms and visualization tools.'
    },
    {
      icon: '🌐',
      title: 'Cloud Infrastructure',
      description: 'Scalable cloud infrastructure solutions that optimize performance and reduce costs.',
      details: 'Design, deploy, and manage cloud infrastructure tailored to your specific needs and workloads.'
    },
    {
      icon: '⚡',
      title: 'Performance Optimization',
      description: 'Enhance application performance and user experience through optimization strategies.',
      details: 'Comprehensive performance optimization services including code optimization, caching strategies, and infrastructure tuning.'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
