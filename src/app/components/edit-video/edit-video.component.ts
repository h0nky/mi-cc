import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Author, Category, VideoFormData } from 'src/app/interfaces';
import { DataService } from 'src/app/services/data.service';
import { combinePayload } from 'src/app/utils/combineFormPayload';
import { normalizeFormData } from 'src/app/utils/normalizeFormData';

@Component({
  selector: 'mi-edit-video',
  templateUrl: './edit-video.component.html',
  styleUrls: ['./edit-video.component.css']
})
export class EditVideoComponent implements OnInit {
  @Input() authors$: Observable<Author[]>;
  @Input() categories$: Observable<Category[]>;
  @Input() placeholder: string = 'Video name'
  
  addVideoFormData: VideoFormData = {
    videoTitle: '',
    selectedAuthor: [],
    selectedCategories: [],
  };

  itemId!: number;

  constructor(
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

    this.route.paramMap.subscribe(params => {
      this.itemId = parseInt(params.get('id') || '0');
      this.dataService.getVideo(this.itemId).subscribe(video => {
        this.addVideoFormData = { ...this.addVideoFormData, videoTitle: video?.name || '' };
      });
    })
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
