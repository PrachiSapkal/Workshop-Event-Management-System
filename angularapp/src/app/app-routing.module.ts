import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { AuthGuard } from './components/authguard/auth.guard';
 
// Admin Components
import { AdminCreateWorkshopEventComponent } from './components/admin-create-workshop-event/admin-create-workshop-event.component';
import { AdminEditWorkshopEventComponent } from './components/admin-edit-workshop-event/admin-edit-workshop-event.component';
import { AdminViewWorkshopEventComponent } from './components/admin-view-workshop-event/admin-view-workshop-event.component';
import { AdminViewBookingsComponent } from './components/admin-view-bookings/admin-view-bookings.component';
import {  AdminviewfeedbackComponent } from './components/adminviewfeedback/adminviewfeedback.component';
 
// User Components
import { UserViewWorkshopEventComponent } from './components/user-view-workshop-event/user-view-workshop-event.component';
import { UserBookWorkshopEventComponent } from './components/user-book-workshop-event/user-book-workshop-event.component';
import { UserAppliedWorkshopEventComponent } from './components/user-applied-workshop-event/user-applied-workshop-event.component';
import { UseraddfeedbackComponent } from './components/useraddfeedback/useraddfeedback.component';
import { UserviewfeedbackComponent } from './components/userviewfeedback/userviewfeedback.component';
import { LoggedUserDetailsComponent } from './components/logged-user-details/logged-user-details.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AllHomeComponent } from './components/allhome/allhome.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
 
// Shared
// import { LoggedUserDetailsComponent } from './components/logged-user-details/logged-user-details.component';
 
const routes: Routes = [
  { path: '', component: AllHomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'error', component: ErrorComponent },
 
  // Admin Routes
  { path: 'admin/home', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/admin-create-workshop-event', component: AdminCreateWorkshopEventComponent, canActivate: [AuthGuard] },
  { path: 'admin/admin-edit-workshop-event/:id', component: AdminEditWorkshopEventComponent, canActivate: [AuthGuard] },
  { path: 'admin/admin-view-workshop-event', component: AdminViewWorkshopEventComponent, canActivate: [AuthGuard] },
  { path: 'admin/admin-view-bookings', component: AdminViewBookingsComponent, canActivate: [AuthGuard] },
  { path: 'admin/adminviewfeedback', component: AdminviewfeedbackComponent, canActivate: [AuthGuard] },
  { path: 'admin/admin-profile', component: LoggedUserDetailsComponent, canActivate: [AuthGuard] },
  { path: 'user-profile/:id', component: UserProfileComponent},
 
  // User Routes
  { path: 'user/home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'user/user-view-workshop-event', component: UserViewWorkshopEventComponent, canActivate: [AuthGuard] },
  { path: 'user/user-book-workshop-event/:id', component: UserBookWorkshopEventComponent, canActivate: [AuthGuard] },
  { path: 'user/user-applied-workshop-event', component: UserAppliedWorkshopEventComponent, canActivate: [AuthGuard] },
  { path: 'user/useraddfeedback', component: UseraddfeedbackComponent, canActivate: [AuthGuard] },
  { path: 'user/userviewfeedback', component: UserviewfeedbackComponent, canActivate: [AuthGuard] },
  { path: 'user/user-profile', component: LoggedUserDetailsComponent, canActivate: [AuthGuard] },
];
 
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}