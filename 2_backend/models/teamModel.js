import mongoose from 'mongoose';
const { Schema } = mongoose;

const teamSchema = new Schema({
  team_name: {
    type: String,
    required: true,
  },
  logo_url: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Team = mongoose.model('team', teamSchema);
export default Team;
