const {User,Course} = require('../db/index');
const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');

// User Routes
router.post('/signup', async(req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;
    // check if user exists
    await User.create({
        username: username,
        password: password
    })
    res.json({
        message: 'User created successfully'
    })
});

router.post('/signin', async(req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.find({
        username,
        password
    })
    if(user){
        const token = jwt.sign({
            username
        },JWT_SECRET)
        res.json({
            token
        });
    }else{
        res.status(411).json({
            message: 'Invalid username or password'
        })
    }
});

router.get('/courses', adminMiddleware, async(req, res) => {
    // Implement fetching all courses logic
    const allCourses = await Course.find({})
    res.json({
        courses: allCourses
    }) 
});

router.post('/courses/:courseId', userMiddleware, async(req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    const username = req.username;
    await User.updateOne({
        username: username,
    },{
        "$push":{
            purchasedCourses: courseId
        }
    });
    res.json({
        message: "Purchased complete"
    });

});

router.get('/purchasedCourses', userMiddleware, async(req, res) => {
    // Implement fetching purchased courses logic
    const user = await User.findOne({
        username: req.username
    })
    const courses = await Course.find({
        _id:{
            "$in": user.purchasedCourses
        }
    });
    res.json({
        courses: courses
    });
});

module.exports = router