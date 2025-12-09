import mongoose from 'mongoose'
const { Schema } = mongoose;

const SessionSchema = new Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  startTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 1
  },
  location: String
});

const ActivityGroupSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  groupName: {
    type: String,
    required: true
  },
  sessions: [SessionSchema] 
});

const ModuleSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  activityGroups: [ActivityGroupSchema] 
});

module.exports = mongoose.model('Module', ModuleSchema);