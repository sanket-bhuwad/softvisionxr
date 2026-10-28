import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  notificationsEnabled = true;
  maintenanceMode = false;
}
