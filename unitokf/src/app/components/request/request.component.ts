import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RequestService } from '../../services/request.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-request-video',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './request.component.html',
})
export class RequestComponent {
  @ViewChild('formSection') formSection!: ElementRef;

  requestForm: FormGroup;
  loading = false;
  successMessage = '';

  institutions = [
    'Chuka University',
    'University of Nairobi',
    'Kenyatta University',
    'Jomo Kenyatta University',
    'Strathmore University',
    'USIU Africa',
    'Daystar University',
    'Mount Kenya University'
  ];

  constructor(
    private fb: FormBuilder,
    private requestService: RequestService,
    private toastr: ToastrService
  ) {
    this.requestForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      details: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      targetInstitution: [''],
    });
  }

  submitRequest() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      
      if (this.requestForm.get('title')?.errors?.['required']) {
        this.toastr.error('Please enter a title for your request');
      } else if (this.requestForm.get('details')?.errors?.['required']) {
        this.toastr.error('Please provide more details about your request');
      } else if (this.requestForm.get('title')?.errors?.['minlength']) {
        this.toastr.error('Title must be at least 5 characters');
      } else if (this.requestForm.get('details')?.errors?.['minlength']) {
        this.toastr.error('Details must be at least 10 characters');
      }
      return;
    }

    this.loading = true;

    this.requestService.createRequest(this.requestForm.value).subscribe({
      next: (response) => {
        this.toastr.success('Request submitted successfully! 🎉', 'Success');
        this.requestForm.reset();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error submitting request:', error);
        const errorMessage = error?.error?.message || 'Failed to submit request. Please try again.';
        this.toastr.error(errorMessage, 'Error');
        this.loading = false;
      },
    });
  }

  scrollToForm(): void {
    if (this.formSection) {
      this.formSection.nativeElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }

  

}