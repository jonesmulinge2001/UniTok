import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalSearchService } from '../../services/global-search.service';
import { ProfileService } from '../../services/profile.service';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { GlobalSearchResult, Profile } from '../../interfaces';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  menuOpen: boolean = false; // Fixed: Use consistent variable name

  searchResults: GlobalSearchResult = { profiles: [], videos: [] };

  logoutModalOpen: boolean = false;
  private searchSubject = new Subject<string>();

  searchPanelOpen: boolean = false;

  searchQuery: string = '';
  isLoggedIn: boolean = false;

  userName = '';
  userImage = '';
  unreadCount = 0;
  window = window;
  loading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private profileService: ProfileService,
    private toastr: ToastrService,
    private searchService: GlobalSearchService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.window = window;
    }
    this.isLoggedIn = this.authService.isLoggedIn();
    document.addEventListener('click', this.closeMenuOnOutsideClick.bind(this));

    // Search subscription
    this.searchSubject
      .pipe(
        debounceTime(300),
        switchMap((query) => {
          this.loading = true;
          return this.searchService.search(query);
        })
      )
      .subscribe({
        next: (res) => {
          this.searchResults = {
            profiles: res.profiles || [],
            videos: res.videos || [],
          };
          this.loading = false;
          this.searchPanelOpen = true;
        },
        error: () => {
          this.loading = false;
          this.searchResults = { profiles: [], videos: [] };
        },
      });

    if (this.isLoggedIn) {
      this.profileService.getMyProfile().subscribe({
        next: (profile: Profile) => {
          this.userName = profile.name;
          this.userImage =
            profile.profileImage || 'https://via.placeholder.com/40';
        },
        error: () => console.error(),
      });
    }
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.closeMenuOnOutsideClick.bind(this));
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleSearchPanel(): void {
    this.searchPanelOpen = !this.searchPanelOpen;
    if (this.searchPanelOpen && this.searchQuery.trim()) {
      this.searchSubject.next(this.searchQuery);
    }
  }

  openLogoutModal(): void {
    this.menuOpen = false;
    this.logoutModalOpen = true;
  }

  closeMenuOnOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Close search panel if clicking outside
    const isInsideSearch = target.closest('.search-container');
    if (!isInsideSearch) {
      this.searchPanelOpen = false;
    }

    // Close menu if clicking outside
    const isInsideMenu = target.closest('.profile-dropdown-container');
    if (!isInsideMenu && this.menuOpen) {
      this.menuOpen = false;
    }
  }

  // Search methods
  onSearchQueryChange(value: string): void {
    this.searchQuery = value;
    if (value.trim()) {
      this.searchSubject.next(value);
    } else {
      this.searchResults = { profiles: [], videos: [] };
      this.searchPanelOpen = false;
    }
  }

  closeSearchPanel(): void {
    this.searchPanelOpen = false;
  }

  viewAllResults(): void {
    this.closeSearchPanel();
    this.router.navigate(['/search'], {
      queryParams: { q: this.searchQuery },
    });
  }

  onSearchItemClick(): void {
    this.closeSearchPanel();
    this.searchQuery = '';
  }

  viewProfile(): void {
    this.menuOpen = false;
    this.router.navigate(['/my-profile']);
  }

  navigateToProfile(profileId: string) {
    this.router.navigate(['/profile', profileId]);
  }

  navigateToVideo(videoId: string) {
    this.router.navigate(['/videos', videoId]);
  }

  navigateToRequestManagement(): void {
    this.menuOpen = false;
    this.router.navigate(['/request-management']);
  }

  logOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userid');
    localStorage.removeItem('role');
    this.logoutModalOpen = false;
    this.router.navigate(['/login']);
  }
}