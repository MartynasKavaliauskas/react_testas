import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router';
import TeamCard from '../components/TeamCard';
import '../styles/TeamScreen.css';

export const TeamsScreen = () => {
  const [teams, setTeams] = useState([]);

  const currentTeamId = localStorage.getItem('teamId');

  const filterTeams = useCallback(
    (teams) => {
      setTeams(teams.filter((team) => team._id !== currentTeamId));
    },
    [currentTeamId]
  );

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/teams')
      .then((response) => {
        filterTeams(response.data);
      })
      .catch((err) => console.log(err.response.data.message));
  }, [filterTeams]);

  const history = useHistory();
  const clearTeamId = () => {
    localStorage.removeItem('teamId');
    history.replace('/');
  };
  return (
    <div className='main__container'>
      <div>
        <button className='logout__btn' onClick={clearTeamId}>
          LOG OUT
        </button>
      </div>
      <h3>Teams Page</h3>
      <section className='cards__container'>
        {teams.map((team) => (
          <TeamCard team={team} setTeams={filterTeams} key={team._id} />
        ))}
      </section>
    </div>
  );
};
