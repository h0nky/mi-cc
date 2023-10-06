import { Video, VideoFormData } from "src/app/interfaces";

export const normalizeFormData = (formData: VideoFormData, lastId: number): Video => {
    return {
        id: lastId + 1,
        catIds: formData.selectedCategories,
        name: formData.videoTitle,
        formats: { 'one': { res: "1080p", size: 1000 }},
        releaseDate: '2018-08-09'
    }
}