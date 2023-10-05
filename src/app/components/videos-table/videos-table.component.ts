import { Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';

import { ProcessedVideo } from 'src/app/interfaces';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'mi-videos-table',
  templateUrl: './videos-table.component.html',
  styleUrls: ['./videos-table.component.css'],
})
export class VideosTableComponent implements OnInit {
  @Input() videos$: Observable<ProcessedVideo[]>;
  @Input() placeholder: string = 'Video name'
  filterCriteria: string;

  constructor(private dataService: DataService, private router: Router) {
    this.videos$ = of([]);
    this.filterCriteria = '';
  }

  ngOnInit(): void {
    this.videos$ = this.dataService.getVideos();
  }

  onFilterApply(): void {
    this.videos$ = this.videos$?.pipe(
      map(videos =>
        videos.filter(({ name }) => name.includes(this.filterCriteria)))
    )
  }

  onVideoEdit(itemId: number): void {
    this.router.navigate(['video', itemId]);
  }

  onVideoDelete(): void {
    console.log('onVideoDelete!');
  }
}
