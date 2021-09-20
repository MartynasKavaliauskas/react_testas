import React, { useState } from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';
import '../styles/LoginScreen.css';

export const LoginScreen = () => {
  // Hooks
  // -- state
  // -- local
  // --- login form
  const [loginTeamName, setLoginTeamName] = useState('');
  const [loginTeamPassword, setloginTeamPassword] = useState('');

  // --- signup form
  const [signupTeamName, setSignupTeamName] = useState('');
  const [signupTeamLogoUrl, setSignupTeamLogoUrl] = useState('');
  const [signupTeamPassword, setSignupTeamPassword] = useState('');
  const [signupErrorMessage, setSignupErrorMessage] = useState('');

  // Redirect
  const history = useHistory();

  // login functions
  const loginHandler = (e) => {
    e.preventDefault();

    axios
      .post('http://localhost:5000/api/teams/login', {
        team_name: loginTeamName,
        password: loginTeamPassword,
      })
      .then((response) => {
        const teamId = response.data.teamId;
        if (response.data.loginStatus === 'failed') {
          return history.replace('/');
        } else {
          localStorage.setItem('teamId', teamId);
          history.replace('/main');
        }
      });
  };

  // sign up function
  const signupHandler = (e) => {
    e.preventDefault();

    axios
      .post('http://localhost:5000/api/teams/signup', {
        team_name: signupTeamName,
        logo_url: signupTeamLogoUrl,
        password: signupTeamPassword,
      })
      .then((response) => {
        if (response.data.status === 'failed') {
          setSignupErrorMessage(response.data.message);

          setSignupTeamName('');
          setSignupTeamPassword('');
        } else if (response.data.status === 'success') {
          localStorage.setItem('teamId', response.data.teamId);

          history.replace('/main');
        }
      });
  };
  return (
    <main>
      <h1> Log in / Sign up </h1>
      <div className='loginScreen__container'>
        <section className='login__section'>
          <h3>Log in</h3>
          <form className='login__form' onSubmit={loginHandler}>
            <div>
              <label htmlFor='loginTeamName'>Team Name</label>
              <br />
              <input
                type='text'
                value={loginTeamName}
                onChange={(e) => setLoginTeamName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor='loginPassword'>Password</label>
              <br />
              <input
                type='password'
                value={loginTeamPassword}
                onChange={(e) => setloginTeamPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <input type='submit' value='Login' />
            </div>
          </form>
        </section>
        <section className='signup__section'>
          <h3>Sign up</h3>
          <form className='signup__form' onSubmit={signupHandler}>
            <div>
              <label htmlFor='signupTeamName'>Team Name</label>
              <br />
              <input
                type='text'
                value={signupTeamName}
                onChange={(e) => setSignupTeamName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor='signupTeamLogo'>Team Logo URL</label>
              <br />
              <input
                type='text'
                value={signupTeamLogoUrl}
                onChange={(e) => setSignupTeamLogoUrl(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor='SignupPassword'>Password</label>
              <br />
              <input
                type='password'
                value={signupTeamPassword}
                onChange={(e) => setSignupTeamPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <input type='submit' value='Sign up' />
            </div>
          </form>
          <p>{signupErrorMessage}</p>
        </section>
      </div>
    </main>
  );
};
