const express = require('express');
const router = express.Router();
const {register_post,login} = require('../controllers/userController')

router.post('/register',register_post);
router.get('/login',login);
module.exports = router;