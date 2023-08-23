const express = require('express');
const router = express.Router();
const {signUp_post,login, logout} = require('../controllers/userController')

router.post('/sign-up',signUp_post);
router.get('/login',login);
router.get('/logout',logout);

module.exports = router;