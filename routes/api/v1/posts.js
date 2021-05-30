const express = require('express');
const router = express.Router();

const passport = require('passport');
const postsApi = require('../../../controllers/api/v1/posts_api');

router.get('/' , postsApi.index);
// authenticate(strategy used , session false - no session cookies to be generated)
router.delete('/delete/:id' , passport.authenticate('jwt' , {session : false}), postsApi.delete);

module.exports = router;