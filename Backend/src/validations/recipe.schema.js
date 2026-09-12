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

// Las recetas viajan como multipart/form-data, asi que `ingredientes` y
// `pasos` llegan como strings JSON, no como arrays: Joi.array() los
// rechazaba y ninguna receta podia crearse. Este helper acepta las dos
// formas, parsea el string cuando hace falta y valida el contenido,
// devolviendo el array ya convertido (cantidades como numeros).
const jsonArrayOf = (itemSchema, min = 1) =>
  Joi.any().custom((value, helpers) => {
    const label = helpers.state.path.join('.');
    let arr = value;

    if (typeof arr === 'string') {
      try {
        arr = JSON.parse(arr);
      } catch {
        return helpers.message(`"${label}" no es JSON valido`);
      }
    }

    const { error, value: validated } = Joi.array().items(itemSchema).min(min).validate(arr);
    if (error) return helpers.message(`"${label}" ${error.details[0].message}`);
    return validated;
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
  ingredientes: jsonArrayOf(ingredientSchema).required(),
  pasos: jsonArrayOf(pasoSchema).required(),
  video_url: Joi.string().uri().allow('', null),
  video_tipo: Joi.string().valid('cloudinary', 'youtube').allow('', null),
});

const updateRecipeSchema = Joi.object({
  titulo: Joi.string().min(3).max(200),
  descripcion: Joi.string().min(10).max(2000),
  tiempo_preparacion: Joi.number().integer().min(1),
  dificultad: Joi.string().valid('facil', 'media', 'dificil'),
  categoria_id: Joi.number().integer().positive(),
  ingredientes: jsonArrayOf(ingredientSchema),
  pasos: jsonArrayOf(pasoSchema),
  video_url: Joi.string().uri().allow('', null),
  video_tipo: Joi.string().valid('cloudinary', 'youtube').allow('', null),
});

const categorySchema = Joi.object({
  nombre: Joi.string().min(3).max(100).required(),
  descripcion: Joi.string().max(500).allow('', null),
});

module.exports = { createRecipeSchema, updateRecipeSchema, categorySchema, UNIDADES_MEDIDA };
