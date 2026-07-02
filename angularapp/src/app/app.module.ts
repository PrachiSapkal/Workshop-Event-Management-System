import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AdminCreateWorkshopEventComponent } from './components/admin-create-workshop-event/admin-create-workshop-event.component';
import { AdminViewWorkshopEventComponent } from './components/admin-view-workshop-event/admin-view-workshop-event.component';
import { AdminEditWorkshopEventComponent } from './components/admin-edit-workshop-event/admin-edit-workshop-event.component';
import { ErrorComponent } from './components/error/error.component';
import { HomeComponent } from './components/home/home.component';
import { UserviewfeedbackComponent } from './components/userviewfeedback/userviewfeedback.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AdminnavComponent } from './components/adminnav/adminnav.component';
import { UsernavComponent } from './components/usernav/usernav.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UseraddfeedbackComponent } from './components/useraddfeedback/useraddfeedback.component';
import { UserAppliedWorkshopEventComponent } from './components/user-applied-workshop-event/user-applied-workshop-event.component';
import { UserBookWorkshopEventComponent } from './components/user-book-workshop-event/user-book-workshop-event.component';
import { UserViewWorkshopEventComponent } from './components/user-view-workshop-event/user-view-workshop-event.component';
import { LoggedUserDetailsComponent } from './components/logged-user-details/logged-user-details.component';
import { AdminviewfeedbackComponent } from './components/adminviewfeedback/adminviewfeedback.component';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AdminViewBookingsComponent } from './components/admin-view-bookings/admin-view-bookings.component';
import { AllHomeComponent } from './components/allhome/allhome.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
// import { Login } from './models/login.model';




@NgModule({
  declarations: [
    AppComponent,
    AdminCreateWorkshopEventComponent,
    AdminViewWorkshopEventComponent,
    AdminEditWorkshopEventComponent,
    ErrorComponent,
    HomeComponent,
    UserviewfeedbackComponent,
    LoginComponent,
    RegistrationComponent,
    AdminnavComponent,
    UsernavComponent,
    NavbarComponent,
    UsernavComponent,
    UseraddfeedbackComponent,
    UserAppliedWorkshopEventComponent,
    UserBookWorkshopEventComponent,
    UserViewWorkshopEventComponent,
    LoggedUserDetailsComponent,
    AdminviewfeedbackComponent,
    UserProfileComponent,
    AdminViewBookingsComponent,
    AllHomeComponent,
    DashboardComponent,
    
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,HttpClientModule,
    FormsModule,ReactiveFormsModule,CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


