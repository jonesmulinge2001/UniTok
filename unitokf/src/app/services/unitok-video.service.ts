import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpEvent, HttpHeaders, HttpEventType } from '@angular/common/http';
import { CreateVideoDto, UpdateVideoDto, Video } from '../interfaces';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnitokVideoService {
  private readonly baseurl = `${environment.apiBase}/videos`;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
  }

  // create video via JSON
  createVideo(payload: CreateVideoDto): Observable<Video> {
    return this.http.post<Video>(this.baseurl, payload, {
      headers: this.getAuthHeaders(),
    });
  }

  // Upload video with progress tracking
  uploadVideoWithProgress(formData: FormData): Observable<HttpEvent<Video>> {
    return this.http.post<Video>(`${this.baseurl}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  // create video via FormData (for file upload) - without progress
  uploadVideo(formData: FormData): Observable<Video> {
    return this.http.post<Video>(this.baseurl, formData);
  }

  // get all videos
  getAllVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(this.baseurl, {
      headers: this.getAuthHeaders(),
    });
  }

  // get a single video
  getVideoById(videoId: string): Observable<Video> {
    return this.http.get<Video>(`${this.baseurl}/${videoId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // update video
  updateVideo(videoId: string, payload: UpdateVideoDto): Observable<Video> {
    return this.http.patch<Video>(`${this.baseurl}/${videoId}`, payload, {
      headers: this.getAuthHeaders(),
    });
  }

  // delete video
  deleteVideo(videoId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseurl}/${videoId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // get all categories
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseurl}/categories`, {
      headers: this.getAuthHeaders(),
    });
  }

  // get videos by category
  getVideosByCategory(category: string): Observable<Video[]> {
    return this.http.get<Video[]>(
      `${this.baseurl}/category/${encodeURIComponent(category)}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }
}