import { Component, Input, OnInit } from '@angular/core';
import { ProcessedVideo } from '../interfaces';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'mi-videos-table',
  templateUrl: './videos-table.component.html',
  styleUrls: ['./videos-table.component.css'],
})
export class VideosTableComponent implements OnInit {
  @Input() videos$: Observable<ProcessedVideo[]> | null;

  constructor(private dataService: DataService) {
    this.videos$ = null;
  }

  ngOnInit(): void {
    this.videos$ = this.dataService.getVideos();
  }
}
