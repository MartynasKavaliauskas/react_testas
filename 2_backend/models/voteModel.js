import mongoose from 'mongoose';
const { Schema } = mongoose;

const voteSchema = new Schema({
  team_id: {
    type: String,
    required: true,
  },
  voting_team_id: {
    type: String,
    required: true,
  },
  vote: {
    type: Number,
    required: true,
  },
});

const Vote = mongoose.model('vote', voteSchema);
export default Vote;
