import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent {
  readonly channels = [
    { name: 'Web Leads', value: 44 },
    { name: 'Referrals', value: 28 },
    { name: 'Campaigns', value: 18 },
    { name: 'Partnerships', value: 10 }
  ];

  readonly conversion = 7.8;
}
