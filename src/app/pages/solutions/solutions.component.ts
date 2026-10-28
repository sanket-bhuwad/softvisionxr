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
      icon: '🧩',
      title: 'Business Management Software',
      description: 'Internal software concepts and prototypes focused on operational workflows, records, and day-to-day business management.',
      details: 'These ideas are designed to be practical, maintainable, and adaptable as business needs evolve.'
    },
    {
      icon: '🌐',
      title: 'Web Platforms',
      description: 'Product ideas for responsive web platforms that can support customers, teams, and internal users.',
      details: 'The focus is on clean structure, scalable architecture, and a solid user experience across devices.'
    },
    {
      icon: '📱',
      title: 'Mobile Applications',
      description: 'Mobile product concepts built for usability, performance, and API integration where needed.',
      details: 'These projects may evolve into customer-facing or operational mobile experiences over time.'
    },
    {
      icon: '⚙️',
      title: 'Productivity Tools',
      description: 'Lightweight software tools that help teams work faster, stay organized, and reduce repetitive tasks.',
      details: 'We explore tools that improve clarity, workflow efficiency, and daily execution.'
    },
    {
      icon: '☁️',
      title: 'SaaS Products',
      description: 'Early-stage software-as-a-service concepts designed around focused use cases and sustainable architecture.',
      details: 'Our goal is to build products that are simple to understand, practical to use, and ready to grow.'
    },
    {
      icon: '🏭',
      title: 'Industry-Focused Software',
      description: 'Software ideas shaped for specific business sectors where workflow automation and usability matter.',
      details: 'These concepts remain exploratory until they are properly defined and built.'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
