import { Video, VideoFormData } from "../interfaces";

export const normalizeFormData = (formData: VideoFormData): Video => {
    return {
        id: Math.random(),
        catIds: formData.selectedCategories,
        name: formData.videoTitle,
        formats: { 'one': { res: "1080p", size: 1000 }},
        releaseDate: '2018-08-09'
    }
}