import cloudinary from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';

export class UploadService {
  static async uploadImage(
    file: Express.Multer.File,
    folder: string = 'smart-coop-hub'
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          transformation: [
            { width: 1000, height: 1000, crop: 'limit' },
            { quality: 'auto' },
          ],
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Upload failed'));
          }
        }
      ).end(file.buffer);
    });
  }

  static async uploadMultipleImages(
    files: Express.Multer.File[],
    folder: string = 'smart-coop-hub'
  ): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadImage(file, folder));
    return Promise.all(uploadPromises);
  }

  static async uploadDocument(
    file: Express.Multer.File,
    folder: string = 'smart-coop-hub/documents'
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          format: 'pdf',
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Upload failed'));
          }
        }
      ).end(file.buffer);
    });
  }

  static async deleteImage(url: string): Promise<void> {
    try {
      // Extract public_id from Cloudinary URL
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      const publicId = filename.split('.')[0];
      const folder = parts.slice(7, -1).join('/');
      
      await cloudinary.uploader.destroy(`${folder}/${publicId}`);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }
}