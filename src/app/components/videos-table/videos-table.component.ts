import { Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';

import { ProcessedVideo } from 'src/app/interfaces';
import { VideoService } from 'src/app/services/videoservice/video.service';


@Component({
  selector: 'mi-videos-table',
  templateUrl: './videos-table.component.html',
  styleUrls: ['./videos-table.component.css'],
})
export class VideosTableComponent implements OnInit {
  @Input() videos$: Observable<ProcessedVideo[]>;
  @Input() placeholder: string = 'Video name'
  filterCriteria: string;

  constructor(
    private router: Router,
    private videoService: VideoService
  ) {
    this.videos$ = of([]);
    this.filterCriteria = '';
  }

  ngOnInit(): void {
    this.videos$ = this.videoService.getProcessedVideos();
  }

  onFilterApply(): void {
    this.videos$ = this.videos$?.pipe(
      map(videos =>
        videos.filter(({ name }) => name.includes(this.filterCriteria)))
    )
  }

  onVideoEdit(itemId: number, authorName: string): void {
    this.router.navigate(['video', itemId, { params: authorName }]);
  }

  onVideoDelete(): void {
    console.log('onVideoDelete!');
  }
}
