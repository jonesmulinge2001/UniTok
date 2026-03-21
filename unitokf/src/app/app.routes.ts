import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { VideoManagerComponent } from './components/video-manager/video-manager.component';
import { StudentLayoutComponent } from './layouts/student-layout/student-layout.component';
import { authGuard } from './guards/auth.guard';
import { CreateProfileComponent } from './components/profile/create-profile/create-profile.component';
import { UpdateProfileComponent } from './components/profile/update-profile/update-profile.component';
import { CreateVideoComponent } from './components/create-video/create-video.component';
import { NetworkComponent } from './components/network/network.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { VideoDetailComponent } from './components/video-detail/video-detail.component';
import { RequestComponent } from './components/request/request.component';
import { RequestManagementComponent } from './components/request-management/request-management.component';

export const routes: Routes = [
      // ==== Public routes (no layout) ====
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  
  // ==== Student routes ====
  {
    path: '',
    component: StudentLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: VideoManagerComponent },
      {path: 'home', component: VideoManagerComponent},
      { path: 'create-profile', component: CreateProfileComponent },
      // { path: 'my-profile', component: MyProfileComponent },
      { path: 'update-profile', component: UpdateProfileComponent },
      {path: 'network', component: NetworkComponent},
      {path: 'create-video', component: CreateVideoComponent},
      { path: 'search', component: SearchResultsComponent },
      { path: 'request', component: RequestComponent },
      { path: 'videos/:id', component: VideoDetailComponent },
      { path: 'request-management', component: RequestManagementComponent },

    ]
  },
];
