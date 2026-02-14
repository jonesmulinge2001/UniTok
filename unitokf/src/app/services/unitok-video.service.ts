import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CreateVideoDto, UpdateVideoDto, Video } from '../interfaces';
import { Observable } from 'rxjs';

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

  // create video via FormData(for file upload)
  uploadVideo(formdata: FormData): Observable<Video> {
    //Do NOT set Content-Type here; HttpClient will set multipart/form-data automatically
    return this.http.post<Video>(this.baseurl, formdata);
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
      headers:  this.getAuthHeaders(),
    });
  }

  // delete video
  deleteVideo(videoId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseurl}/${videoId}`, {
      headers: this.getAuthHeaders(),
    });
  }


}
