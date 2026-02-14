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
      { path: 'create-profile', component: CreateProfileComponent },
      // { path: 'my-profile', component: MyProfileComponent },
      { path: 'update-profile', component: UpdateProfileComponent },

    ]
  },
];
