import { Observable, map, of } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';

import { ProcessedVideo } from '../../interfaces';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'mi-videos-table',
  templateUrl: './videos-table.component.html',
  styleUrls: ['./videos-table.component.css'],
})
export class VideosTableComponent implements OnInit {
  @Input() videos$: Observable<ProcessedVideo[]>;
  @Input() placeholder: string = 'Video name'
  filterCriteria: string;

  constructor(private dataService: DataService) {
    this.videos$ = of([]);
    this.filterCriteria = '';
  }

  ngOnInit(): void {
    this.videos$ = this.dataService.getVideos();
  }

  onFilterApply(): void {
    this.videos$ = this.videos$?.pipe(
      map(videos =>
        videos.filter(video => {
          return video.name.includes(this.filterCriteria);
        }))
    )
  }

  onVideoEdit(): void {
    console.log('onVideoEdit!');
  }

  onVideoDelete(): void {
    console.log('onVideoDelete!');
  }
}
