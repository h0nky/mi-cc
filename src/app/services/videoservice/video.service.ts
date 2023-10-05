import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';

import { Author, CategoriesMap, Category, EditVideoView, Format, ProcessedVideo } from 'src/app/interfaces';
import { DataService } from 'src/app/services/dataservice/data.service';
import { getHttpHeaders } from 'src/app/utils/getHttpHeaders';
import { API } from 'src/app/constants';


@Injectable({
  providedIn: 'root',
})
export class VideoService {
  constructor(private http: HttpClient, private dataService: DataService) {}

  getProcessedVideos(): Observable<ProcessedVideo[]> {
    const categoriesMap$ = this.dataService.getCategories().pipe(
      map(categories => this.getCategoriesMap(categories))
    )

    return this.dataService.getAuthors().pipe(
      switchMap(authors => {
        const videoObservables$ = this.createVideoObservables(authors, categoriesMap$);
        return forkJoin(videoObservables$);
      })
    );
  }

  getVideo(authorName: string, videoId: number): Observable<EditVideoView> {
    return this.dataService.getAuthors().pipe(
      map(authors => {
        const author = authors.find(({ name }) => name === authorName);

        if (!author) {
          throw new Error(`Author with name ${authorName} not found`);
        }

        const video = author?.videos.find(({ id }) => id === videoId);

        if (!video) {
          throw new Error(`Video with ID ${videoId} not found for author ${authorName}`);
        }

        return { ...video, authorId: author?.id };
      })
    )
  }

  setNewVideo(newVideoData: Author, authorId: number): Observable<HttpResponse<Object>> {
    const payload = JSON.stringify(newVideoData);
    const httpOptions = getHttpHeaders();
    return this.http.put(`${API}/authors/${authorId}`, payload, httpOptions);
  }

  private createVideoObservables(authors: Author[], categoriesMap$: Observable<CategoriesMap>): Observable<ProcessedVideo>[] {
    return authors.flatMap(({ name: authorName, videos }) => {
      return videos.map(({ id: videoId, name: videoName, catIds, releaseDate, formats }) => {
        const categoryObservables$ = catIds.map(catId =>
          categoriesMap$.pipe(map(categoryMap => categoryMap[catId]))
        );
  
        const newFormats: Format[] = Object.entries(formats).map(([key, format]) => ({ ...format, key }));
        const highestResolutionFormat = this.getHQFormat(newFormats);
  
        return forkJoin(categoryObservables$).pipe(
          map(categories => ({
            id: videoId,
            name: videoName,
            author: authorName,
            categories,
            releaseDate,
            format: highestResolutionFormat,
          }))
        );
      });
    });
  }

  private getCategoriesMap(categories: Category[]): CategoriesMap {
    return categories.reduce((acc, { id, name }) => {
      acc = { ...acc, [id]: name }
      return acc;
    }, {})
  }

  private getHQFormat(newFormats: Format[]): string {
    const sortedFormats = newFormats.sort((a, b) => {
      return parseInt(b.res) - parseInt(a.res) && b.size - a.size;
    });
    const { key, res } = sortedFormats[0];
    return `${key} ${res}`;
  }
}
