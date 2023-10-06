import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';

import { DataService } from 'src/app/services/dataservice/data.service';
import { Author, Category, Video, VideoFormData } from 'src/app/interfaces';
import { normalizeFormData } from 'src/app/utils/normalizeFormData';
import { combineAddFormPayload } from 'src/app/utils/combineFormPayload';
import { VideoService } from 'src/app/services/videoservice/video.service';
import { INVALID_AUTHOR_ID_ERROR, NORMALIZE_DATA_ERROR, VIDEO_UPDATE_ERROR } from 'src/app/constants';


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
      throw new Error(INVALID_AUTHOR_ID_ERROR);
    }

    const normalizedFormData$ = this.getNormalizedFormData$(formData);
    const combinedPayload$ = combineAddFormPayload(this.authors$, normalizedFormData$, authorId);
    
    combinedPayload$.subscribe(payload => {
      this.videoService.setNewVideo(payload, authorId)
      .subscribe(response => this.handleResponse(response.ok));
    })
}

private getNormalizedFormData$(formData: VideoFormData): Observable<Video> {
  return this.videoService.getFullVideoIdList().pipe(
    // Take last video id to create a video with unique id
    map(ids => normalizeFormData(formData, ids[ids.length -1])),
    catchError(error => {
      console.error(NORMALIZE_DATA_ERROR, error);
      return of([]) as unknown as Observable<Video>;
    })
  )
}

handleResponse(responseSuccess: boolean): void {
  if (responseSuccess) {
    this.onRedirectToMain();
  } else {
    console.error(VIDEO_UPDATE_ERROR);
  }
}

  onAddVideoCancelClicked(): void {
    this.onRedirectToMain();
  }

  onRedirectToMain(): void {
    this.router.navigate(['/']);
  }
}

