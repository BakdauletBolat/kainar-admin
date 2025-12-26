import { defineStore } from 'pinia';
import { getFeedbacks, closeFeedback } from '../api/feedback.api';
import type { Feedback } from './types';

export const useFeedbackStore = defineStore('feedback', {
  state: () => {
    return {
      feedbacks: [] as Feedback[],
      count: 0,
      isLoading: false,
    };
  },
  actions: {
    async loadFeedbacks(options: Object) {
      this.isLoading = true;
      return getFeedbacks(options)
        .then((res) => {
          this.feedbacks = res.data.results;
          this.count = res.data.count;
          return res.data.results;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async closeFeedback(feedbackId: number) {
      this.isLoading = true;
      return await closeFeedback(feedbackId)
        .then((_) => {
          const index = this.feedbacks.findIndex((feedback: Feedback) => feedback.id === feedbackId);
          if (index != -1) {
            this.feedbacks[index].completed_at = new Date();
          }
        })
        .catch((err) => {
          console.log(err);
          throw err;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
});
