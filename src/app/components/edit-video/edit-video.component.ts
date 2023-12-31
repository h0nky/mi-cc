import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest, map, of } from 'rxjs';
import { INVALID_AUTHOR_ID_ERROR, VIDEO_UPDATE_ERROR } from 'src/app/constants';

import { Author, Category, EditVideoView, VideoFormData } from 'src/app/interfaces';
import { DataService } from 'src/app/services/dataservice/data.service';
import { VideoService } from 'src/app/services/videoservice/video.service';
import { combineUpdateFormPayload } from 'src/app/utils/combineFormPayload';

@Component({
  selector: 'mi-edit-video',
  templateUrl: './edit-video.component.html',
  styleUrls: ['./edit-video.component.css']
})
export class EditVideoComponent implements OnInit {
  @Input() authors$: Observable<Author[]>;
  @Input() categories$: Observable<Category[]>;
  @Input() placeholder: string = 'Video name'
  
  formData: VideoFormData = {
    videoTitle: '',
    selectedAuthor: [],
    selectedCategories: [],
  };

  itemId!: number;
  authorName!: string;

  constructor(
    private videoService: VideoService,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.authors$ = of([]);
    this.categories$ = of([]);
  }

  ngOnInit(): void {
    this.authors$ = this.dataService.getAuthors();
    this.categories$ = this.dataService.getCategories();
    this.fetchVideoData();
  }

  private fetchVideoData(): void {
    this.route.paramMap.subscribe(params => {
      this.itemId = parseInt(params.get('id') || '0');
      this.authorName = this.route.snapshot.params['params'];

      this.videoService.getVideo(this.authorName, this.itemId).subscribe(video => {
        this.formData = this.setVideoData(video);
      });
    })
  }

  private setVideoData(video: EditVideoView): VideoFormData {
    const authorId = video.authorId?.toString() || '';
    return {
      videoTitle: video.name || '',
      selectedAuthor: [authorId],
      selectedCategories: video.catIds || [] 
    }
  }

  onFormSubmit(formData: VideoFormData): void {
    const authorId = parseInt(formData.selectedAuthor[0]);

    if (isNaN(authorId)) {
      throw new Error(INVALID_AUTHOR_ID_ERROR);
    }

    const combinedPayload$ = combineLatest([
      this.videoService.getFullVideoIdList(),
      this.authors$
    ]).pipe(
      map(([ids, authors]) =>
        // Take last video id to create a video with unique id
        combineUpdateFormPayload(authors, authorId, this.itemId, formData, ids[ids.length - 1])
      )
    );
    
    combinedPayload$.subscribe(payload => {
      this.videoService.setNewVideo(payload, authorId)
      .subscribe(response => this.handleResponse(response.ok));
    })
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
