const Joi = require('joi');

const registerSchema = Joi.object({
  nombre1: Joi.string().min(2).max(100).required().messages({
    'string.min': 'El primer nombre debe tener al menos 2 caracteres',
    'string.max': 'El primer nombre no puede exceder 100 caracteres',
    'any.required': 'El primer nombre es requerido',
  }),
  nombre2: Joi.string().max(100).allow('', null),
  apellido1: Joi.string().min(2).max(100).required().messages({
    'string.min': 'El primer apellido debe tener al menos 2 caracteres',
    'any.required': 'El primer apellido es requerido',
  }),
  apellido2: Joi.string().max(100).allow('', null),
  email: Joi.string().email().required().custom((value, helpers) => {
    const allowed = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'live.com', 'icloud.com', 'protonmail.com', 'mail.com', 'aol.com', 'ymail.com', 'zoho.com', 'yandex.com', 'gmx.com', 'fastmail.com'];
    const domain = value.split('@')[1]?.toLowerCase();
    if (!domain || !allowed.includes(domain)) {
      return helpers.message('Solo se permiten correos de dominios conocidos (Gmail, Hotmail, Outlook, Yahoo, etc.)');
    }
    return value;
  }).messages({
    'string.email': 'El email no es válido',
    'any.required': 'El email es requerido',
  }),
  contraseña: Joi.string().min(8).max(128).required().messages({
    'string.min': 'La contraseña debe tener al menos 8 caracteres',
    'any.required': 'La contraseña es requerida',
  }),
  bio: Joi.string().max(500).allow('', null),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'El email no es válido',
    'any.required': 'El email es requerido',
  }),
  contraseña: Joi.string().required().messages({
    'any.required': 'La contraseña es requerida',
  }),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  contraseña: Joi.string().min(8).max(128).required(),
});

const changePasswordSchema = Joi.object({
  contraseñaActual: Joi.string().required(),
  nuevaContraseña: Joi.string().min(8).max(128).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
};
