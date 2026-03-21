import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { UniTokRequest } from '../../interfaces';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-request-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './request-management.component.html',
  styleUrls: ['./request-management.component.css']
})
export class RequestManagementComponent implements OnInit, OnDestroy {
  requests: UniTokRequest[] = [];
  filteredRequests: UniTokRequest[] = [];
  isLoading = false;
  selectedRequest: UniTokRequest | null = null;
  showRequestModal = false;
  showDeleteModal = false;
  searchQuery = '';
  selectedFilter: 'all' | 'my-requests' = 'all';
  currentUserId: string = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private requestService: RequestService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.currentUserId = localStorage.getItem('userId') || '';
    this.loadRequests();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.requestService.getAllRequests()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (requests) => {
          this.requests = requests;
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading requests:', error);
          this.toastr.error('Failed to load requests', 'Error');
          this.isLoading = false;
        }
      });
  }

  applyFilters(): void {
    let filtered = [...this.requests];
    
    // Filter by user
    if (this.selectedFilter === 'my-requests') {
      filtered = filtered.filter(r => r.requester.id === this.currentUserId);
    }
    
    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(query) ||
        r.details.toLowerCase().includes(query) ||
        r.requester.name.toLowerCase().includes(query) ||
        (r.targetInstitution && r.targetInstitution.toLowerCase().includes(query))
      );
    }
    
    this.filteredRequests = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  openRequestDetails(request: UniTokRequest): void {
    this.selectedRequest = request;
    this.showRequestModal = true;
  }

  closeRequestModal(): void {
    this.showRequestModal = false;
    this.selectedRequest = null;
  }

  openDeleteModal(request: UniTokRequest, event: Event): void {
    event.stopPropagation();
    this.selectedRequest = request;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedRequest = null;
  }

  deleteRequest(): void {
    if (!this.selectedRequest) return;
    
    this.requestService.deleteRequest(this.selectedRequest.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastr.success('Request deleted successfully', 'Success');
          this.loadRequests();
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Error deleting request:', error);
          this.toastr.error('Failed to delete request', 'Error');
        }
      });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`;
    } else if (diffHours < 168) {
      return `${Math.floor(diffHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  getStatusBadgeClass(request: UniTokRequest): string {
    // You can add status logic if needed
    return 'bg-green-100 text-green-700';
  }

  getStatusText(request: UniTokRequest): string {
    // You can add status logic if needed
    return 'Open';
  }

  getUserRequestsCount(): number {
    return this.requests.filter(r => r.requester.id === this.currentUserId).length;
  }
  
  getUniqueInstitutionsCount(): number {
    const institutions = this.requests
      .map(r => r.targetInstitution)
      .filter(inst => inst);
    return new Set(institutions).size;
  }
}