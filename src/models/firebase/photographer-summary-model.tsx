export default interface PhotographerSummaryModel {
  name?: string;
  devicesName?: string[];
  pricePerPhoto?: number;
  minPhotos?: number;
  profilePicture: string;
  ratingAverage?: string;
}