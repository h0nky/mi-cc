import { Observable, forkJoin, map } from "rxjs";
import { Author, Video } from "../interfaces";

const getUpdatedAuthor = ({ authors, newVideo }: { authors: Author[], newVideo: Video }, authorId: number): Author => {
    const specificAuthor = authors.find(({ id }) => id === authorId);

    if (!specificAuthor) {
        throw new Error(`Author with id ${authorId} not found.`);
    }

    return {
      ...specificAuthor,
      videos: [...specificAuthor.videos, newVideo],
    };
}

export const combinePayload = (authors$: Observable<Author[]>, formData$: Observable<Video>, authorId: number): Observable<Author> => {
    return forkJoin({
        authors: authors$,
        newVideo: formData$,
      })
      .pipe(
        map(data => getUpdatedAuthor(data, authorId))
      )
}