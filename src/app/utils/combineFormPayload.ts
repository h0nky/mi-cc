import { Observable, forkJoin, map } from "rxjs";

import { Author, Video, VideoFormData } from "src/app/interfaces";
import { normalizeFormData } from "src/app/utils/normalizeFormData";
import { INVALID_AUTHOR_ID_ERROR } from "src/app/constants";

// Add video form
export const combineAddFormPayload = (authors$: Observable<Author[]>, formData$: Observable<Video>, authorId: number): Observable<Author> => {
    return forkJoin({ authors: authors$, newVideo: formData$ }).pipe(
        map(data => getUpdatedAuthor(data, authorId))
    )
}

const getUpdatedAuthor = ({ authors, newVideo }: { authors: Author[], newVideo: Video }, authorId: number): Author => {
  const specificAuthor = authors.find(({ id }) => id === authorId);

  if (!specificAuthor) {
    throw new Error(INVALID_AUTHOR_ID_ERROR);
  }

  return {
    ...specificAuthor,
    videos: [...specificAuthor.videos, newVideo],
  };
}


export const combineUpdateFormPayload = (authors: Author[], authorId: number, videoId: number, formData: VideoFormData, lastId: number): Author => {
  const author = authors.find(({ id }) => id === authorId);

  if (!author) {
    throw new Error(INVALID_AUTHOR_ID_ERROR);
  }

  const currentVideo = author?.videos.find(({ id }) => id === videoId);
  const otherVideos = author?.videos.filter(({ id }) => id !== videoId);

  const newVideo = currentVideo ? updateVideo(currentVideo, formData) : normalizeFormData(formData, lastId);
  const newVideos = otherVideos ? [...otherVideos, newVideo] : [newVideo];

  return { ...author, videos: newVideos };
}

const updateVideo = (currentVideo: Video, formData: VideoFormData): Video => ({
  ...currentVideo,
  name: formData.videoTitle,
  catIds: formData.selectedCategories,
})