import { Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';

import { ProcessedVideo } from 'src/app/interfaces';
import { VideoService } from 'src/app/services/videoservice/video.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { DataService } from 'src/app/services/dataservice/data.service';


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
    private videoService: VideoService,
    private dataSerice: DataService,
    private dialog: MatDialog
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

  onVideoDelete(videoId: number, authorName: string): void {
    const ref = this.dialog.open(DeleteConfirmationComponent);
    
    ref.afterClosed().subscribe(result => {
      if (result) {
        const payload$ = this.dataSerice.getAuthors().pipe(
          map(
            authors => {
              const author = authors.find(({ name }) => name === authorName);

              if (!author) {
                throw new Error('Invalid author ID');
              }

              const newVideos = author?.videos.filter(({ id }) => id !== videoId);
              return { ...author, videos: newVideos };
            }
          )
        )
        
        payload$
        .subscribe(payload => this.videoService.setNewVideo(payload, payload.id)
        .subscribe()
        );
      }
    })
  }
}
