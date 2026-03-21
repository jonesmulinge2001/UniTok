import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Follow, Profile } from '../../interfaces';
import { ProfileService } from '../../services/profile.service';
import { CommonModule } from '@angular/common';
import { FollowService } from '../../services/follow.service';
import { Router } from '@angular/router';
import { StudentCardComponent } from '../shared/student-card/student-card.component';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil, forkJoin, timer } from 'rxjs';

@Component({
  imports: [CommonModule, StudentCardComponent],
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit, OnDestroy {
  currentUserId: string = '';
  selectedTab: 'all' | 'following' | 'followers' = 'all';

  allProfiles: Profile[] = [];
  following: Follow[] = [];
  followers: Follow[] = [];

  loading: boolean = false;
  private destroy$ = new Subject<void>();

  @Input() profile!: Profile;
  @Input() isFollowing = false;

  constructor(
    private profileService: ProfileService, 
    private followService: FollowService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.currentUserId = localStorage.getItem('userId') || '';
    this.fetchAllData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchAllData() {
    this.loading = true;

    const allProfiles$ = this.profileService.getAllProfiles();
    const following$ = this.followService.getFollowing(this.currentUserId);
    const followers$ = this.followService.getFollowers(this.currentUserId);

    // Use forkJoin to wait for all requests
    forkJoin({
      all: allProfiles$,
      following: following$,
      followers: followers$
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (result) => {
        this.allProfiles = result.all.filter(p => p.userId !== this.currentUserId);
        this.following = result.following;
        this.followers = result.followers;
        
        // Ensure minimum loading time for better UX
        timer(500).subscribe(() => {
          this.loading = false;
        });
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.toastr.error('Failed to load network data', 'Error');
        this.loading = false;
      }
    });
  }

  isUserFollowing(userId: string): boolean {
    return this.following.some(f => f.followingId === userId);
  }

  followUser(userId: string) {
    this.followService.followUser(userId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.toastr.success('Successfully followed user', 'Success');
        this.fetchAllData();
      },
      error: (err) => {
        console.error('Error following user:', err);
        this.toastr.error('Failed to follow user', 'Error');
      }
    });
  }
  
  unfollowUser(userId: string) {
    this.followService.unFollowUser(userId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.toastr.info('Unfollowed user', 'Success');
        this.fetchAllData();
      },
      error: (err) => {
        console.error('Error unfollowing user:', err);
        this.toastr.error('Failed to unfollow user', 'Error');
      }
    });
  }

  getDisplayedProfiles(): Profile[] {
    if (this.selectedTab === 'all') {
      return this.allProfiles;
    } else if (this.selectedTab === 'following') {
      return this.following.map(f => f.following!.profile);
    } else if (this.selectedTab === 'followers') {
      return this.followers.map(f => f.follower!.profile);
    }
    return [];
  }
}