const router = require('express').Router();
const userRoutes = require('./user.route');
// const { auth } = require('../index');

//Write your routes here.....
router.use('/user', userRoutes);

router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the APP'
    });
});

module.exports = router;