const express = require('express');
const router = express.Router();

// controller for home 
const home_controller = require('../controllers/home_controller');

//  routes for home page & controller
router.get('/' , home_controller.start);
router.get('/home' , home_controller.home);
// router.get('/' , );


router.use('/api' , require('./api'));

// make file uploads path available to browser for user to add a file to website
router.use('/uploads', express.static(__dirname + '/uploads'));

// any other route , refer to its route page
router.use('/users' , require('./users'));
router.use('/posts' , require('./posts'));
router.use('/comments', require('./comments'));
router.use('/likes', require('./likes'));

console.log("routes loaded");


module.exports = router;