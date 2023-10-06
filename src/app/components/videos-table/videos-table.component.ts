import { Router } from '@angular/router';
import { Observable, map, of, switchMap } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Author, ProcessedVideo } from 'src/app/interfaces';
import { VideoService } from 'src/app/services/videoservice/video.service';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { DataService } from 'src/app/services/dataservice/data.service';
import { INVALID_AUTHOR_ID_ERROR } from 'src/app/constants';


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
    ref.afterClosed()
    .subscribe(result => result ? this.handleVideoDeletion(videoId, authorName) : null)
  }

  private handleVideoDeletion(videoId: number, authorName: string): void {
    this.dataSerice.getAuthors().pipe(
      map(authors => this.pruneAuthorVideos(authors, authorName, videoId)),
      switchMap(updatedAuthor => this.videoService.setNewVideo(updatedAuthor, updatedAuthor.id)))
      .subscribe(() => this.videos$ = this.videoService.getProcessedVideos());
  }

  private pruneAuthorVideos(authors: Author[], authorName: string, videoId: number): Author {
    const author = authors.find(({ name }) => name === authorName);
  
    if (!author) {
      throw new Error(INVALID_AUTHOR_ID_ERROR);
    }

    const newVideos = author?.videos.filter(({ id }) => id !== videoId);
    return { ...author, videos: newVideos };
  }
}
