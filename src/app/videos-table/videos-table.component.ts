import { Component, Input, OnInit } from '@angular/core';
import { ProcessedVideo } from '../interfaces';
import { DataService } from '../data.service';
import { Observable, map } from 'rxjs';


@Component({
  selector: 'mi-videos-table',
  templateUrl: './videos-table.component.html',
  styleUrls: ['./videos-table.component.css'],
})
export class VideosTableComponent implements OnInit {
  @Input() videos$: Observable<ProcessedVideo[]> | undefined;
  filterCriteria: string;

  constructor(private dataService: DataService) {
    this.videos$ = undefined;
    this.filterCriteria = '';
  }

  ngOnInit(): void {
    this.videos$ = this.dataService.getVideos();
  }

  onFilterClick(): void {
    this.videos$ = this.videos$?.pipe(
      map(videos =>
        videos.filter(video => {
          console.log(this.filterCriteria);
          return video.name.includes(this.filterCriteria);
        }))
    )
  }
}
