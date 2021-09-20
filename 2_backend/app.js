import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Team from './models/teamModel.js';
import Vote from './models/voteModel.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

//Middlewares
app.use(cors());
app.use(express.json());

// Connecting to mongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    console.log(`Connected to MongoDB`);

    // Starting server
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
  });

//   Actions
const getTeamData = async () => {
  const teams = await Team.find({});
  const votes = await Vote.find({});

  const result = teams.map((team) => {
    const score = votes
      .filter((vote) => vote.team_id === team._id.toString())
      .reduce((acc, { vote }) => acc + vote, 0);
    return {
      ...team.toObject(),
      score,
    };
  });

  result.sort((a, b) => {
    if (a.score > b.score) return -1;
    if (a.score < b.score) return 1;
    return a.team_name.toString().localeCompare(b.team_name);
  });
  return result;
};

//Routes
app.get('/', (req, res) => res.send('API is runnig....'));

app.get('/api/teams', async (req, res) => {
  return res.json(await getTeamData());
});

// GET: single team based on his id
app.get('/api/teams/:id', async (req, res) => {
  const teamId = req.params.id;

  const team = await Team.findById(teamId);
  const vote = await Vote.find({ team_id: teamId });

  res.json({ ...team, vote });
});

// POST: register new team
app.post('/api/teams/signup', (req, res) => {
  let team = req.body;

  Team.find().then((result) => {
    const teamExist = result.some(
      (teamFromDB) => teamFromDB.team_name === team.team_name
    );

    if (teamExist) {
      res.json({
        status: 'failed',
        message: 'Team with given name already exist',
      });
    } else {
      team.votes = [];

      const newTeam = new Team(team);

      newTeam.save().then((result) => {
        let { _id } = result;
        res.json({
          status: 'success',
          teamId: _id,
        });
      });
    }
  });
});

// POST: Log in existing team
app.post('/api/teams/login', (req, res) => {
  let team = req.body;

  Team.find().then((result) => {
    const teamFounded = result.find(
      (teamFromDB) =>
        teamFromDB.team_name === team.team_name &&
        teamFromDB.password === team.password
    );
    if (teamFounded) {
      let { _id } = teamFounded;

      res.json({
        loginStatus: 'success',
        teamId: _id,
      });
    } else {
      res.json({
        loginStatus: 'failed',
        message: 'Given email or password is incorrect',
      });
    }
  });
});

// Send vote to DB
app.post('/api/votes', async (req, res) => {
  const { currentTeamId, vote, teamId } = req.body; // body of the request with vote being 1 or -1

  const voteExists = await Vote.findOne({
    team_id: teamId,
    voting_team_id: currentTeamId,
  }); // { team_id: 1, voting_team_id: 2, vote: 1 }, null
  // console.log(voteExists);

  if (voteExists) {
    return res
      .status(400)
      .send({ message: 'Your team has already cast a vote for this team.' });
  }
  if (currentTeamId === teamId) {
    return res.status(400).send({ message: "Team can't vote for them selfs" });
  }

  const newVote = new Vote({
    team_id: teamId,
    voting_team_id: currentTeamId,
    vote,
  });
  await newVote.save();

  return res.json(await getTeamData());
});
