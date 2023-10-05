import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { DataService } from 'src/app/services/dataservice/data.service';
import { Author, Category, VideoFormData } from 'src/app/interfaces';
import { normalizeFormData } from 'src/app/utils/normalizeFormData';
import { combineAddFormPayload } from 'src/app/utils/combineFormPayload';
import { VideoService } from 'src/app/services/videoservice/video.service';


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

  constructor(
    private videoService: VideoService,
    private dataService: DataService,
    private router: Router
  ) {
    this.authors$ = of([]);
    this.categories$ = of([]);
  }

  ngOnInit(): void {
    this.authors$ = this.dataService.getAuthors();
    this.categories$ = this.dataService.getCategories();
  }

  onFormSubmit(formData: VideoFormData): void {
    const authorId = parseInt(formData.selectedAuthor[0]);

    if (isNaN(authorId)) {
      throw new Error('Invalid author ID');
    }

    const normalizedFormData$ = of(normalizeFormData(formData));
    const combinedPayload$ = combineAddFormPayload(this.authors$, normalizedFormData$, authorId);
    
    combinedPayload$.subscribe(payload => {
      this.videoService.setNewVideo(payload, authorId)
      .subscribe(response => this.handleResponse(response.ok));
    })
  }

handleResponse(responseSuccess: boolean): void {
  if (responseSuccess) {
    this.onRedirectToMain();
  } else {
    console.error('An error occured while adding new video');
  }
}

  onAddVideoCancelClicked(): void {
    this.onRedirectToMain();
  }

  onRedirectToMain(): void {
    this.router.navigate(['/']);
  }
}

