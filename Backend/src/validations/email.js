const Joi = require('joi');

const DOMINIOS_PERMITIDOS = [
  'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'live.com',
  'icloud.com', 'protonmail.com', 'mail.com', 'aol.com', 'ymail.com',
  'zoho.com', 'yandex.com', 'gmx.com', 'fastmail.com',
];

// Compartido entre el registro y la edición de perfil. Cuando la regla vivía
// sólo en registerSchema, bastaba con registrarse desde un dominio permitido
// y luego cambiar el email a cualquier otro desde el perfil.
const emailPermitido = Joi.string().email().custom((value, helpers) => {
  const dominio = value.split('@')[1]?.toLowerCase();
  if (!dominio || !DOMINIOS_PERMITIDOS.includes(dominio)) {
    return helpers.message('Solo se permiten correos de dominios conocidos (Gmail, Hotmail, Outlook, Yahoo, etc.)');
  }
  return value;
}).messages({ 'string.email': 'El email no es válido' });

module.exports = { emailPermitido, DOMINIOS_PERMITIDOS };
