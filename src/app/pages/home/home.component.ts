import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, style, transition, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        query('.animate-item', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(100, [
            animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
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
export class HomeComponent {

  services = [
    {
      icon: '💻',
      title: 'Web & Software Development',
      description: 'Modern web applications and software solutions for businesses, teams, and operations.'
    },
    {
      icon: '📱',
      title: 'Mobile App Development',
      description: 'Usable mobile applications built with performance, scalability, and maintainability in mind.'
    },
  ];

  products = [
    {
      icon: '🧩',
      title: 'Business Management Software',
      description: 'Internal and future-facing management tools designed around real operational needs.'
    },
    {
      icon: '🌐',
      title: 'Web Platforms',
      description: 'Responsive platforms built for customers, teams, and business workflows.'
    },
    {
      icon: '📱',
      title: 'Mobile Applications',
      description: 'Practical mobile products that connect cleanly with APIs and backend systems.'
    },
    {
      icon: '⚙️',
      title: 'Productivity Tools',
      description: 'Simple software tools that improve clarity, workflow, and execution.'
    },
    {
      icon: '☁️',
      title: 'SaaS Products',
      description: 'Early-stage software products that can grow into sustainable platforms.'
    },
    {
      icon: '🏭',
      title: 'Industry-Focused Solutions',
      description: 'Software concepts tailored for specific business needs and use cases.'
    }
  ];

  technology = [
    {
      icon: '🎨',
      title: 'Frontend',
      description: 'Angular, React, TypeScript, JavaScript, HTML, CSS, Bootstrap, Angular Material'
    },
    {
      icon: '🛠️',
      title: 'Backend',
      description: 'Node.js and Express.js for API-led application development'
    },
    {
      icon: '🗄️',
      title: 'Database',
      description: 'MySQL for database-driven systems and structured application data'
    },
    {
      icon: '🔐',
      title: 'API & Authentication',
      description: 'REST APIs and JWT authentication for secure application flows'
    }
  ];

  whySoftvisionxr = [
    {
      icon: '✨',
      title: 'Modern Technology',
      description: 'We work with current frameworks and practical tools that support maintainable software.'
    },
    {
      icon: '🧱',
      title: 'Clean & Maintainable Development',
      description: 'We prefer code and structure that are easier to understand, extend, and support.'
    },
    {
      icon: '📈',
      title: 'Scalable Architecture',
      description: 'We design software with growth in mind so applications can evolve over time.'
    },
    {
      icon: '👤',
      title: 'User-Focused Design',
      description: 'We keep the product experience clear, usable, and aligned with real tasks.'
    },
    {
      icon: '⚡',
      title: 'Performance-Oriented Engineering',
      description: 'We pay attention to responsiveness, reliability, and efficient implementation.'
    },
    {
      icon: '🧭',
      title: 'Long-Term Product Thinking',
      description: 'We build with the future in mind, not just the immediate delivery moment.'
    }
  ];

  goals = [
    {
      icon: '1',
      title: 'Build Practical Software',
      description: 'Create useful software products that solve real-world problems.'
    },
    {
      icon: '2',
      title: 'Deliver Quality',
      description: 'Focus on clean architecture, performance, security, usability and maintainable code.'
    },
    {
      icon: '3',
      title: 'Build Our Own Products',
      description: 'Grow SOFTVISIONXR through products, platforms and software solutions developed by our own team.'
    },
    {
      icon: '4',
      title: 'Innovate & Grow',
      description: 'Continuously improve our technology, products and capabilities as the company grows.'
    }
  ];

  teamMembers = [
    {
      initials: 'SB',
      name: 'Sanket Bhuwad',
      role: 'Founder & Full Stack Developer',
      description: 'Founder of SOFTVISIONXR and a Full Stack Developer focused on building modern web applications, software products and scalable digital solutions.',
      badge: 'Founder',
      featured: true
    },
    {
      initials: 'TK',
      name: 'Tejas Keni',
      role: 'Full Stack Developer',
      description: 'Full Stack Developer with experience in building robust software applications and contributing to scalable technology solutions.',
      featured: false
    },
    {
      initials: 'SK',
      name: 'Sukanya Kondhapure',
      role: 'Full Stack Developer',
      description: 'Full Stack Developer focused on developing reliable, maintainable and user-focused software applications.',
      featured: false
    },
    {
      initials: 'SK',
      name: 'Sagar Kardile',
      role: 'DevOps Engineer',
      description: 'DevOps Engineer focused on development infrastructure, deployment workflows, automation and reliable software delivery.',
      featured: false
    }
  ];

  processSteps = [
    {
      icon: '1',
      title: 'Understand',
      description: 'Start with the problem, users, and business context.'
    },
    {
      icon: '2',
      title: 'Plan',
      description: 'Define scope, priorities, and delivery milestones.'
    },
    {
      icon: '3',
      title: 'Design',
      description: 'Shape the product experience and information structure.'
    },
    {
      icon: '4',
      title: 'Develop',
      description: 'Build the application with maintainable code and clean architecture.'
    },
    {
      icon: '5',
      title: 'Test',
      description: 'Check usability, reliability, and technical quality before release.'
    },
    {
      icon: '6',
      title: 'Improve',
      description: 'Refine the product based on feedback and practical usage.'
    },
    {
      icon: '7',
      title: 'Launch',
      description: 'Release when the product is ready and stable enough to support.'
    }
  ];

  constructor(private router: Router) { }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  trackByIndex(index: number): number {
    return index;
  }

  trackByMember(index: number, member: { name: string }): string {
    return member.name;
  }
}
