const express = require('express');
const router = express.Router();
const {register_post,login, logout} = require('../controllers/userController')

router.post('/register',register_post);
router.get('/login',login);
router.get('/logout',logout);

module.exports = router;