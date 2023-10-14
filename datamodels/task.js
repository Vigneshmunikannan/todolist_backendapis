const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskid: { type: Number, required: true },
    taskname: { type: String, required: true },
    taskdescription: { type: String, required: true },
    username: { type: String, required: true },
    status: {
        type: String,
        enum: ['not completed', 'completed'],
        default: 'not completed', 
      },
},{
    timestamps: true,
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
