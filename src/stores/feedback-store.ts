import {defineStore} from "pinia";
import axiosInstance from "@/apis";
import generateQuery from "@/utils/generateQuery.ts";

export interface IFeedback {
    id: number;
    name: string;
    phone: string;
    created_at: Date;
    updated_at: Date;
    completed_at: Date | null;
}
export const useFeedbackStore = defineStore("feedback-store", {
    state: () => {
        return {
            feedbacks: [] as IFeedback[],
            count: 0,
            isLoading: false,
        };
    },
    actions: {
        async loadFeedbacks(options: Object) {
            const query = generateQuery(options);
            this.isLoading = true;
            return axiosInstance
                .get(`/api/admin/feedback/${query}`)
                .then((res) => {
                    this.feedbacks = res.data.results;
                    this.count = res.data.count;
                    return res.data.results;
                }).finally(() => {
                    this.isLoading = false;
                });
        },
        async closeFeedback(feedbackId: number) {
            this.isLoading = true;
            return await axiosInstance.patch(`/api/admin/feedback/${feedbackId}/`, {
                completed_at: new Date().toISOString(),
            }).then((_) => {
                const index = this.feedbacks.findIndex((feedback: IFeedback) => feedback.id === feedbackId);
                if (index != -1) {
                    this.feedbacks[index].completed_at = new Date();
                }
            }).catch((err) => {
                console.log(err);
                throw err;
            })
                .finally(() => {
                    this.isLoading = false;
                });
        }
    },
});
