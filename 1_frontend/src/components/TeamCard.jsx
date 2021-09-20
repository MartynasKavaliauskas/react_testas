import axios from 'axios';
import React, { useRef } from 'react';
import '../styles/TeamCard.css';

const TeamCard = ({ team, setTeams }) => {
  let upvote = useRef(false);
  let downvote = useRef(false);

  const increment = () => {
    if (!upvote.current) {
      axios
        .post('http://localhost:5000/api/votes', {
          teamId: team._id,
          currentTeamId: localStorage.getItem('teamId'),
          vote: 1,
        })
        .then((response) => setTeams(response.data))
        .catch((err) => console.log(err.response.data.message));

      upvote.current = true;
    }
  };

  const decrement = () => {
    if (!downvote.current) {
      axios
        .post('http://localhost:5000/api/votes', {
          teamId: team._id,
          currentTeamId: localStorage.getItem('teamId'),
          vote: -1,
        })
        .then((response) => setTeams(response.data))
        .catch((err) => console.log(err.response.data.message));

      downvote.current = true;
    }
  };
  return (
    <div className='card__container'>
      <h3>{team.team_name}</h3>
      <div className='card__img-container'>
        <img src={team.logo_url} alt='' />
      </div>

      <p>Score: {team.score}</p>
      <div className='card__btn-container'>
        <button className='btn btn-danger' onClick={decrement}>
          -1
        </button>
        <button className='btn btn-success' onClick={increment}>
          +1
        </button>
      </div>
      <p></p>
    </div>
  );
};

export default TeamCard;
