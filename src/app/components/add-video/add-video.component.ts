import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { DataService } from '../../services/data.service';
import { Author, Category, VideoFormData } from 'src/app/interfaces';
import { normalizeFormData } from 'src/app/utils/normalizeFormData';
import { combinePayload } from 'src/app/utils/combineFormPayload';


@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.css']
})
export class AddVideoComponent implements OnInit {
  addVideoFormData: VideoFormData = {
    videoTitle: '',
    selectedAuthor: [],
    selectedCategories: [],
  };
  @Input() authors$: Observable<Author[]>;
  @Input() categories$: Observable<Category[]>;
  @Input() placeholder: string = 'Video name'

  constructor(private dataService: DataService, private router: Router) {
    this.authors$ = of([]);
    this.categories$ = of([]);
  }

  ngOnInit(): void {
    this.authors$ = this.dataService.getAuthors();
    this.categories$ = this.dataService.getCategories();
  }

  onAddVideoFormSubmitted(formData: VideoFormData): void {
    const authorId = parseInt(formData.selectedAuthor[0]);

    if (isNaN(authorId)) {
      throw new Error('Invalid author ID');
    }

    const newVideoNormalized = normalizeFormData(formData);
    const normalizedFormDataObservable$ = of(newVideoNormalized);

    const combinedPayload$ = combinePayload(this.authors$, normalizedFormDataObservable$, authorId);
    
    combinedPayload$
    .subscribe(payload => {
      this.dataService
      .setVideo(payload, authorId)
      .subscribe(response => {
        if (response.ok) {
          this.onRedirectToMain();
        } else {
          console.error('An error occured while adding new video');
        }
      });
    })
  }

  onAddVideoCancelClicked(): void {
    this.onRedirectToMain();
  }

  onRedirectToMain(): void {
    this.router.navigate(['/']);
  }
}

