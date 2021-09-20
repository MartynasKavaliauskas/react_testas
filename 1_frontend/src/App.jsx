import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import { AuthRoute } from './components/AuthRoute';

import { TeamsScreen } from './screens/TeamsScreen';
import { LoginScreen } from './screens/LoginScreen';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' render={() => <Redirect to='/login' />} />
          <Route path='/login' component={LoginScreen} />

          <AuthRoute path='/main' component={TeamsScreen} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
