import cloudinary from '../config/cloudinary';
import multer from 'multer';
import { AppError } from '../middleware/errorHandler';

// Multer: Disk yerine memory storage (RAM) kullanılır
const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(400, 'Yalnızca JPG, PNG ve WebP formatları kabul edilir'));
    }
  },
});

/**
 * Görseli Cloudinary'ye yükler
 */
export async function uploadImage(
  buffer: Buffer,
  folder: string,
  publicId?: string
): Promise<{ url: string; publicId: string }> {
  // Config kontrolü
  if (!cloudinary.config().cloud_name || cloudinary.config().cloud_name === 'demo') {
    throw new AppError(500, 'Cloudinary yapılandırması eksik veya hatalı (.env dosyasını kontrol edin)');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, public_id: publicId, resource_type: 'image' },
      (error, result) => {
        if (error) {
          console.error('Detailed Cloudinary Error:', error);
          reject(new AppError(500, `Cloudinary Hatası: ${error.message}`));
        } else {
          resolve({
            url: result!.secure_url,
            publicId: result!.public_id,
          });
        }
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Görseli Cloudinary'den siler
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    throw new AppError(500, 'Görsel silinirken bir hata oluştu');
  }
}
