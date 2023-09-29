import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from './constants';
import { Author, Category, ProcessedVideo } from './interfaces';
import { Observable, forkJoin, map, switchMap } from 'rxjs';

interface CategoriesMap {
  [key: string]: string
}

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
    const categories = this.getCategories();
    const authors = this.getAuthors();

    const categoriesMap: Observable<CategoriesMap> = categories.pipe(
      map(categories => categories.reduce((acc, curr) => {
        acc = { ...acc, [curr.id]: curr.name }
        return acc;
      }, {})),
    )

    return authors.pipe(
      switchMap(authors => {
        const videoObservables = authors.flatMap(({ name: authorName, videos }) => {
          return videos.map(({ id: videoId, name: videoName, catIds }) => {
            const categoryObservable = catIds.map(catId => {
              return categoriesMap.pipe(
                map(categoryMap => categoryMap[catId])
              );
            });

            return forkJoin(categoryObservable).pipe(
              map(categories => ({
                id: videoId,
                name: videoName,
                author: authorName,
                categories,
                format: '',
                releaseDate: '',
              }))
            )
          })
        });

        return forkJoin(videoObservables);
      })
    );
  }
}
