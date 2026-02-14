import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LikeStatusResponse, VideoLikeResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class VideoLikeService {
  private readonly baseUrl = `${environment.apiBase}/video-like`;

  constructor(
    private http: HttpClient
  ) { }

  // get auth headers
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
  }

  // like a video
  likeVideo(videoId: string): Observable<VideoLikeResponse> {
    return this.http.post<VideoLikeResponse>(`${this.baseUrl}/${videoId}`, {
      Headers: this.getAuthHeaders(),
    });
  }

  // unLike video
  unLikeVideo(videoId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${videoId}`, {
      headers: this.getAuthHeaders(),
    });
  }

    /** Check if current user liked the video */
    hasLiked(videoId: string): Observable<LikeStatusResponse> {
      return this.http.get<LikeStatusResponse>(`${this.baseUrl}/${videoId}`, {
        headers: this.getAuthHeaders(),
      });
    }

}
