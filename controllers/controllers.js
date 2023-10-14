const asynchandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const User = require('../datamodels/register');
const Task = require('../datamodels/task')
const jwt = require('jsonwebtoken')
const tokenBlacklist = require("../tokenBlacklist")


const register = asynchandler(async (req, res) => {
    const { username, name, password } = req.body;

    if (!username || !password || !name) {
        res.status(400);
        throw new Error('All fields are mandatory'); // Return after setting status code
    }
    const usernameAvailable = await User.findOne({ username });
    console.log("finding user name");
    if (usernameAvailable) {
        console.log("im found user");
        res.status(409);
        throw new Error('Username already taken') // Return after setting status code
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        username,
        name,
        password: hashedPassword,
    });

    if (user) {
        res.status(200).json({
            id: user.id,
            msg: 'Registration success',
        });
    } else {
        res.status(400);
        throw new Error('User data not valid');
    }
});

const login = asynchandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400)
        throw new Error('All fields are mandatory')
    }
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {

        // jwt has 3 parameter
        // 1. user deatails,
        // 2. ACCESS_TOKEN_SECERT
        // 3.expiry time
        const accessToken = jwt.sign({
            user: {
                username: user.username
            }
        }, process.env.ACCESS_TOKEN_SECERT, { expiresIn: "30m" })
        res.status(200).json({
            accessToken: accessToken,
            username: user.name,
            "msg": "login success and token will expires after 30min"
        })
    }
    else {
        res.status(401).json({ msg: "Invalid username or password" })
        throw new Error("email or password is not valid")
    }
})

const addtask = asynchandler(async (req, res) => {
    const { username, taskname, taskdescription } = req.body;
    // Check if the task is already in the list
    const currentuser = req.user.username;
    if (currentuser !== username) {
        res.status(401);
        throw new Error('Access Denied due to mismatch of username');
    }
    const avilabletask = await Task.findOne({ taskname: taskname, username: currentuser, status: "not completed" });
    if (avilabletask) {
        res.status(409);
        throw new Error('Task is already in the list');
    }

    // Find the user and get the current totalTasks
    const user = await User.findOne({ username });
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Calculate the next taskid based on the user's totalTasks
    const taskid = user.totalTasks + 1;
    user.totalTasks = taskid;

    // Update the user's totalTasks
    await user.save();

    // Create the task
    const task = await Task.create({
        taskid: taskid,
        taskname: taskname,
        taskdescription: taskdescription,
        username: currentuser,
        status: 'not completed'
    });

    if (task) {
        console.log("im inside task")
        res.status(200).json({
            taskid: task.taskid,
            taskname: task.taskdescription,
            msg: 'Added successfully'
        });
    } else {
        res.status(400);
        throw new Error('Task data not valid');
    }
});

const updatestatus = asynchandler(async (req, res) => {
    const {
        username, taskname
    } = req.body
    const currentuser = req.user.username;
    if (currentuser !== username) {
        res.status(401);
        throw new Error('Access Denied due to mismatch of username');
    }
    const avilabletask = await Task.findOne({ taskname: taskname, username: currentuser, status: "not completed" });
    if (!avilabletask) {
        res.status(404)
        throw new Error('Task Not found');
    }
    avilabletask.status = 'completed';

    const updated = await avilabletask.save();
    if (updated) {
        res.status(200).json({
            taskid: avilabletask.taskid,
            taskname: avilabletask.taskname,
            msg: 'Changed successfully'
        });
    }
    else {
        res.status(400);
        throw new Error('Updation Failed');
    }


})

const deletetask = asynchandler(async (req, res) => {
    const {
        username, taskname
    } = req.body
    const currentuser = req.user.username;
    if (currentuser !== username) {
        res.status(401);
        throw new Error('Access Denied due to mismatch of username');
    }
    const avilabletask = await Task.findOne({ taskname: taskname, username: currentuser, status: 'not completed' });
    if (!avilabletask) {
        res.status(404);
        throw new Error('Task not found')
    }
    const taskid = avilabletask._id;
    const deletedtask = await Task.deleteOne({ _id: taskid })
    if (deletedtask) {
        res.status(200).json({
            msg: "Deleted successfully",
            taskid: avilabletask.taskid,
            taskname: avilabletask.taskname,
        })
    }
    else {
        res.status(500)
        throw new Error('Failed to delete the task')
    }

})

const getallcompletedtaskofsingleuser = asynchandler(async (req, res) => {
    const {
        username
    } = req.body
    const currentuser = req.user.username;
    if (currentuser !== username) {
        res.status(401);
        throw new Error('Access Denied due to mismatch of username');
    }
    const completedtask = await Task.find({ username: username, status: 'completed' })

    if (!completedtask) {
        res.status(404)
        throw new Error("User not found")
    }
    const taskdata = completedtask.map((item) => {
        return {
            taskid: item.taskid,
            taskname: item.taskname,
            taskdescription: item.taskdescription
        };
    });

    res.status(200).json({
        success: true,
        taskdata
    })


})

const getallnotcompletedtaskofsingleuser = asynchandler(async (req, res) => {
    const {
        username
    } = req.body
    const currentuser = req.user.username;
    if (currentuser !== username) {
        res.status(401);
        throw new Error('Access Denied due to mismatch of username');
    }
    const completedtask = await Task.find({ username: username, status: 'not completed' })

    if (!completedtask) {
        res.status(404)
        throw new Error("User not found")
    }
    const taskdata = completedtask.map((item) => {
        return {
            taskid: item.taskid,
            taskname: item.taskname,
            taskdescription: item.taskdescription
        };
    });

    res.status(200).json({
        success: true,
        taskdata
    })
})

const getalltaskofuser = asynchandler(async (req, res) => {
    const {
        username
    } = req.body
    const currentuser = req.user.username;
    if (currentuser !== username) {
        res.status(401);
        throw new Error('Access Denied due to mismatch of username');
    }
    const completedtask = await Task.find({ username: username })

    if (!completedtask) {
        res.status(404)
        throw new Error("User not found")
    }
    const taskdata = completedtask.map((item) => {
        return {
            taskid: item.taskid,
            taskname: item.taskname,
            taskdescription: item.taskdescription
        };
    });

    res.status(200).json({
        success: true,
        taskdata
    })
})

const logout = asynchandler(async (req, res) => {
    const {
        username
    } = req.body
    const currentuser = req.user.username;
    if (currentuser !== username) {
        res.status(401);
        throw new Error('Access Denied due to mismatch of username');
    }
    const token = req.header('Authorization').split(" ")[1];
    tokenBlacklist.add(token);
    if (tokenBlacklist.has(token)) {
        console.log("added successfully")
    }
    res.status(200).json({ message: 'Logged out successfully' });
})

module.exports = {
    register,
    login,
    addtask,
    updatestatus,
    deletetask,
    getallcompletedtaskofsingleuser,
    getallnotcompletedtaskofsingleuser,
    getalltaskofuser,
    logout
};
