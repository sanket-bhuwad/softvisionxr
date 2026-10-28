import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { TeamComponent } from './pages/team/team.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UsersComponent } from './pages/users/users.component';

@NgModule({
  declarations: [
    AdminComponent,
    OverviewComponent,
    AnalyticsComponent,
    TeamComponent,
    UsersComponent,
    SettingsComponent,
    ProfileComponent
  ],
  imports: [CommonModule, FormsModule, AdminRoutingModule]
})
export class AdminModule {}
