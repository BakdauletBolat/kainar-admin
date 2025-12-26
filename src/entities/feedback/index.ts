export { useFeedbackStore } from './model/feedback.store';
export type {
  Feedback,
  Product,
  ProductDetailed,
  ProductStatus,
  ProductImage,
  ProductDetail,
  ProductView,
  OemCode,
  MileageType,
  FeedbackWithDetailedProduct
} from './model/types';
export { ProductStatus as ProductStatusEnum } from './model/types';
export { getFeedbacks, closeFeedback } from './api/feedback.api';
export { default as ProductDetailCard } from './ui/ProductDetailCard.vue';
