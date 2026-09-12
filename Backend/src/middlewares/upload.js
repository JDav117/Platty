const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

const storage = multer.memoryStorage();

const TIPOS_IMAGEN = ['image/jpeg', 'image/png', 'image/webp'];
const TIPOS_VIDEO = ['video/mp4', 'video/webm', 'video/quicktime'];

const LIMITE_IMAGEN = 10 * 1024 * 1024;
const LIMITE_VIDEO = 100 * 1024 * 1024;

// Antes había un único multer para todo: aceptaba videos en los endpoints de
// imágenes y aplicaba el tope de 100MB en todos, así que un archivo de 90MB se
// cargaba entero en memoria y recién después se rechazaba por superar los 10MB.
// Ahora cada tipo tiene su filtro y su límite, y multer corta durante la subida.
const filtroPor = (permitidos, etiqueta) => (req, file, cb) => {
  if (permitidos.includes(file.mimetype)) return cb(null, true);
  cb(new Error('Formato de archivo no permitido. Solo ' + etiqueta), false);
};

const uploaderImagen = multer({
  storage,
  fileFilter: filtroPor(TIPOS_IMAGEN, 'imágenes (JPEG, PNG, WebP)'),
  limits: { fileSize: LIMITE_IMAGEN },
});

const uploaderVideo = multer({
  storage,
  fileFilter: filtroPor(TIPOS_VIDEO, 'videos (MP4, WebM, MOV)'),
  limits: { fileSize: LIMITE_VIDEO },
});

const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'yum_yum',
        resource_type: 'auto',
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

const uploadImages = uploaderImagen.array('imagenes', 5);
const uploadSingleImage = uploaderImagen.single('imagen');
const uploadVideo = uploaderVideo.single('video');

const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'Archivo demasiado grande. Máximo 10MB por imagen' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ success: false, message: 'Demasiados archivos. Máximo 5 imágenes' });
    }
    return res.status(400).json({ success: false, message: `Error de subida: ${err.message}` });
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
};

module.exports = { uploadToCloudinary, uploadImages, uploadSingleImage, uploadVideo, handleUploadError };
