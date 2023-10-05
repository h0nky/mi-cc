import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, find, forkJoin, map, switchMap } from 'rxjs';
import { API } from '../constants';
import { Author, CategoriesMap, Category, Format, ProcessedVideo } from '../interfaces';
import { getHttpHeaders } from '../utils/getHttpHeaders';


@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${API}/categories`);
  }

  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(`${API}/authors`);
  }

  getVideos(): Observable<ProcessedVideo[]> {
    const categoriesMap$ = this.getCategories().pipe(
      map(categories => this.createCategoriesMap(categories))
    )

    return this.getAuthors()
    .pipe(
      switchMap(authors => {
        const videoObservables$ = this.createVideoObservables(authors, categoriesMap$);
        return forkJoin(videoObservables$);
      })
    );
  }

  getVideo(videoId: number): Observable<ProcessedVideo | undefined> {
    return this.getVideos().pipe(
      map(videos => videos.find(({ id }) => id === videoId))
    )
  }

  setVideo(newVideoData: Author, authorId: number): Observable<HttpResponse<Object>> {
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

  private createCategoriesMap(categories: Category[]): CategoriesMap {
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
