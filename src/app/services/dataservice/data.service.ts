import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API } from 'src/app/constants';
import { Author, Category } from 'src/app/interfaces';


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
}
