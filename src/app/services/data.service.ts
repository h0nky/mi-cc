import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { API } from '../constants';
import { Author, CategoriesMap, Category, Format, ProcessedVideo } from '../interfaces';


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

    const processedVideos$ = this.getAuthors().pipe(
      switchMap(authors => {
        const videoObservables$ = this.createVideoObservables(authors, categoriesMap$);
        return forkJoin(videoObservables$);
      })
    );

    return processedVideos$;
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
