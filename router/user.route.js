const router = require('express').Router();
const { auth, checkAuth} = require('../index');
const User = require('../models/User');
const Sensor = require('../models/Sensor');
const  {sendsms} = require('../util/sendsms');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            status: 400,
            type: 'error',
            message: 'Invalid email'
        });
    }
    if (!auth.isValidPassword(password, user.password)) {
        return res.status(400).json({
            status: 400,
            type: 'error',
            message: 'Invalid password'
        });
    }
    const token = auth.generateToken({
        email: user.email,
        userType: 'user'
    });
    res.json({
        status: 200,
        message: 'Login successful',
        token
    });
});

router.post('/get-sensors', checkAuth , auth.checkUserType("user"), async (req, res) => {
    const { name } = req.body;
    const sensor = await Sensor.findOne({ name });
    if (!sensor) {
        return res.status(400).json({
            status: 400,
            type: 'error',
            message: 'Invalid sensor name'
        });
    }
    res.json({
        status: 200,
        sensor
    });
});

router.post('/update-sensor', checkAuth , auth.checkUserType("user"), async (req, res) => {
    const { name, carbon, co, oxygen, co2, so2 } = req.body;
    const sensor = await Sensor.findOne({ name });
    if (!sensor) {
        return res.status(400).json({
            status: 400,
            type: 'error',
            message: 'Invalid sensor name'
        });
    }

    if (carbon > 90) {
        sendsms({message:`Carbon level is high ${carbon}`, contactNumber:'8610038173'});
    }
    if (co > 90) {
        sendsms({message:`co level is high ${co}`, contactNumber:'8610038173'});
    }
    if (oxygen > 90) {
        sendsms({message:`oxygen level is high ${oxygen}`, contactNumber:'8610038173'});
    }

    if (co2 > 90) {
        sendsms({message:`Co2 level is high ${co2}`, contactNumber:'8610038173'});
    }

    if (so2 > 90) {
        sendsms({message:`so2 level is high ${so2}`, contactNumber:'8610038173'});
    }

    sensor.carbon = carbon;
    sensor.co = co;
    sensor.oxygen = oxygen;
    sensor.co2 = co2;
    sensor.so2 = so2;
    await sensor.save();
    res.json({
        status: 200,
        message: 'Sensor updated successfully'
    });
});



module.exports = router;