import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {
  readonly kpiCards = [
    { label: 'Total Projects', value: '48', trend: '+12%' },
    { label: 'Active Clients', value: '19', trend: '+5%' },
    { label: 'Team Utilization', value: '87%', trend: '+3%' },
    { label: 'Monthly Revenue', value: '$124K', trend: '+9%' }
  ];

  readonly tasks = [
    'Finalize Q2 product roadmap',
    'Approve cloud cost optimization plan',
    'Review onboarding flow for enterprise clients'
  ];
}
