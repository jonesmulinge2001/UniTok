import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateRequestDto, UniTokRequest, UpdateRequestDto } from '../interfaces';


@Injectable({
  providedIn: 'root',
})
export class RequestService {

  private baseUrl = 'http://localhost:3000/unitok-requests';

  constructor(private http: HttpClient) {}

  createRequest(data: CreateRequestDto): Observable<UniTokRequest> {
    return this.http.post<UniTokRequest>(this.baseUrl, data);
  }

  getAllRequests(): Observable<UniTokRequest[]> {
    return this.http.get<UniTokRequest[]>(this.baseUrl);
  }

  getRequestById(id: string): Observable<UniTokRequest> {
    return this.http.get<UniTokRequest>(`${this.baseUrl}/${id}`);
  }

  updateRequest(id: string, data: UpdateRequestDto): Observable<UniTokRequest> {
    return this.http.patch<UniTokRequest>(`${this.baseUrl}/${id}`, data);
  }

  deleteRequest(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}