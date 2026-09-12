const Joi = require('joi');
const { emailPermitido } = require('./email');

const updateProfileSchema = Joi.object({
  nombre1: Joi.string().min(2).max(100),
  nombre2: Joi.string().max(100).allow('', null),
  apellido1: Joi.string().min(2).max(100),
  apellido2: Joi.string().max(100).allow('', null),
  bio: Joi.string().max(500).allow('', null),
  // misma restricción de dominios que el registro
  email: emailPermitido,
});

// receta_id debe declararse aquí: validate() corre con stripUnknown,
// así que cualquier campo ausente del schema se borra del body antes
// de llegar al handler.
const commentSchema = Joi.object({
  receta_id: Joi.number().integer().positive().required().messages({
    'any.required': 'receta_id es requerido',
  }),
  contenido: Joi.string().min(1).max(2000).required(),
  parent_id: Joi.number().integer().positive().allow(null),
});

const ratingSchema = Joi.object({
  receta_id: Joi.number().integer().positive().required().messages({
    'any.required': 'receta_id es requerido',
  }),
  puntaje: Joi.number().integer().min(1).max(5).required(),
});

module.exports = { updateProfileSchema, commentSchema, ratingSchema };
