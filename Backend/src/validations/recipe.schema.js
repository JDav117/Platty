const Joi = require('joi');

const UNIDADES_MEDIDA = [
  'kg', 'g', 'mg', 'l', 'ml', 'unidades', 'tazas', 'cucharadas',
  'cucharaditas', 'pizca', 'al_gusto', 'oz', 'lb', 'paquete', 'lata', 'diente'
];

const ingredientSchema = Joi.object({
  nombre: Joi.string().min(1).max(200).required(),
  cantidad: Joi.number().positive().required(),
  unidad: Joi.string().valid(...UNIDADES_MEDIDA).required(),
});

const pasoSchema = Joi.object({
  descripcion: Joi.string().min(1).max(2000).required(),
  orden: Joi.number().integer().min(1).required(),
});

const createRecipeSchema = Joi.object({
  titulo: Joi.string().min(3).max(200).required().messages({
    'string.min': 'El título debe tener al menos 3 caracteres',
    'any.required': 'El título es requerido',
  }),
  descripcion: Joi.string().min(10).max(2000).required(),
  tiempo_preparacion: Joi.number().integer().min(1).required(),
  dificultad: Joi.string().valid('facil', 'media', 'dificil').required(),
  categoria_id: Joi.number().integer().positive().required(),
  ingredientes: Joi.array().items(ingredientSchema).min(1).required(),
  pasos: Joi.array().items(pasoSchema).min(1).required(),
  video_url: Joi.string().uri().allow('', null),
  video_tipo: Joi.string().valid('cloudinary', 'youtube').allow('', null),
});

const updateRecipeSchema = Joi.object({
  titulo: Joi.string().min(3).max(200),
  descripcion: Joi.string().min(10).max(2000),
  tiempo_preparacion: Joi.number().integer().min(1),
  dificultad: Joi.string().valid('facil', 'media', 'dificil'),
  categoria_id: Joi.number().integer().positive(),
  ingredientes: Joi.array().items(ingredientSchema).min(1),
  pasos: Joi.array().items(pasoSchema).min(1),
  video_url: Joi.string().uri().allow('', null),
  video_tipo: Joi.string().valid('cloudinary', 'youtube').allow('', null),
});

const categorySchema = Joi.object({
  nombre: Joi.string().min(3).max(100).required(),
  descripcion: Joi.string().max(500).allow('', null),
});

module.exports = { createRecipeSchema, updateRecipeSchema, categorySchema, UNIDADES_MEDIDA };
