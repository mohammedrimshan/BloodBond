export interface ICloudinaryService {
  uploadImage(file: string, folder?: string): Promise<{ url: string; publicId: string }>;
  deleteImage(publicId: string): Promise<void>;
}
