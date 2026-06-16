const Joi = require('joi');

const updateProfileSchema = Joi.object({
  nombre1: Joi.string().min(2).max(100),
  nombre2: Joi.string().max(100).allow('', null),
  apellido1: Joi.string().min(2).max(100),
  apellido2: Joi.string().max(100).allow('', null),
  bio: Joi.string().max(500).allow('', null),
  email: Joi.string().email(),
});

const commentSchema = Joi.object({
  contenido: Joi.string().min(1).max(2000).required(),
  parent_id: Joi.number().integer().positive().allow(null),
});

const ratingSchema = Joi.object({
  puntaje: Joi.number().integer().min(1).max(5).required(),
});

module.exports = { updateProfileSchema, commentSchema, ratingSchema };
