const express = require('express');
const router = express.Router();
const { initialData } = require('../../controller/admin/initialData');
// const { validateSignupRequest, validateSigninRequest, isRequestValidated } = require('../../validators/auth');
const { requireSignin, adminMiddleware } = require('../../common-middleware');

router.post('/initialdata', requireSignin, adminMiddleware, initialData);

module.exports = router;