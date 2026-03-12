import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent {
  readonly members = [
    { name: 'Aarav Mehta', role: 'Product Lead', status: 'Available' },
    { name: 'Ira Kulkarni', role: 'UX Engineer', status: 'In Sprint' },
    { name: 'Karan Joshi', role: 'Backend Architect', status: 'Code Review' },
    { name: 'Sana Sheikh', role: 'QA Specialist', status: 'Testing' }
  ];
}
