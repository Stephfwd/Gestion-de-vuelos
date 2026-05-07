const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');

// Validaciones
const registerValidation = [
  body('nombre', 'El nombre es obligatorio').not().isEmpty(),
  body('email', 'Agrega un email válido').isEmail(),
  body('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
  validateFields
];

const loginValidation = [
  body('email', 'Agrega un email válido').isEmail(),
  body('password', 'La contraseña es obligatoria').not().isEmpty(),
  validateFields
];

router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);

module.exports = router;
