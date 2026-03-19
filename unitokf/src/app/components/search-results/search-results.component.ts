import { Component, OnInit } from '@angular/core';
import { GlobalSearchResult } from '../../interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalSearchService } from '../../services/global-search.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-results',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent implements OnInit{
  query: string = '';
  results: GlobalSearchResult = { profiles: [], videos: []};

  loading: boolean = false;
  error: string = '';
  activeTab: 'all' | 'profiles' | 'videos' = 'all';

  constructor(
    private route: ActivatedRoute,
    private searchService: GlobalSearchService,
    private router: Router
  ){}

  ngOnInit(): void {
    // Get search query from URL
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      if(this.query.trim()) {
        this.performSearch();
      }
    });
  }

  performSearch(): void {
    if(!this.query.trim()) {
      this.results = { profiles: [], videos: []}
      return;
    }
    this.loading = true;
    this.error = '';
    this.searchService.search(this.query).subscribe({
      next: (res) => {
        this.results = {
          profiles: res.profiles || [],
          videos: res.videos || []
        },
        this.loading = false;
      },
      error: (err) => {
        console.log('Search error: ', err);
        this.error = 'Failed to load search results';
        this.loading = false;
        this.results = { profiles: [], videos: []};
      }
    });
  }

  setActiveTab(tab: 'all' | 'profiles' | 'videos'): void {
    this.activeTab = tab;
  }

  getFilteredResults() {
    switch(this.activeTab) {
      case 'profiles':
        return { profiles: this.results.profiles, vidoes: [] };
      case 'videos':
        return { profiles: [], videos: this.results }
    }
    return this.results;
  }

  searchOnEnter(event: KeyboardEvent): void {
    if(event.key === 'Enter') {
      this.performSearch();
    }
  }

  get totalResults(): number {
    return(
      this.results.profiles.length + 
      this.results.videos.length 
    );
  }

  navigateToProfile(profileId: string) {
    this.router.navigate(['/profile', profileId]);
  }

  navigateToVideo(videoId: string) {
    this.router.navigate(['/vidoes', videoId]);
  }

}
