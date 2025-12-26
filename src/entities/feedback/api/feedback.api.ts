import axiosInstance from '@/shared/api/axios';
import generateQuery from '@/shared/lib/generateQuery';
import type { Feedback } from '../model/types';

export async function getFeedbacks(options: Object) {
  const query = generateQuery(options);
  return await axiosInstance.get<{
    results: Feedback[];
    count: number;
  }>(`/api/admin/feedback/${query}`);
}

export async function closeFeedback(feedbackId: number) {
  return await axiosInstance.patch(`/api/admin/feedback/${feedbackId}/`, {
    completed_at: new Date().toISOString(),
  });
}
