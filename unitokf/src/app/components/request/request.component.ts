import { Component } from '@angular/core';
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

  requestForm: FormGroup;
  loading = false;
  successMessage = '';

  institutions = [
    'Chuka University',
    'University of Nairobi',
    'Kenyatta University',
    'Jomo Kenyatta University',
  ];

  constructor(
    private fb: FormBuilder,
    private requestService: RequestService,
    private toastr: ToastrService
  ) {
    this.requestForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      details: ['', [Validators.required, Validators.minLength(10)]],
      targetInstitution: [''],
    });
  }

  submitRequest() {

    if (this.requestForm.invalid) return;

    this.loading = true;

    this.requestService.createRequest(this.requestForm.value).subscribe({
      next: () => {
        this.toastr.success('Request submitted successfully!');
        this.requestForm.reset();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}