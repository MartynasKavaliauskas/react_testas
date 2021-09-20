import React from 'react';
import { Redirect, Route } from 'react-router-dom';

export const AuthRoute = ({ ...props }) => {
  const teamId = localStorage.getItem('teamId');

  if (!teamId) {
    return <Redirect to='/' />;
  }

  return <Route {...props} />;
};
