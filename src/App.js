import React from 'react';
import { Route, Switch } from 'react-router-dom';

import routes from './routes.js'

function App(props) {
  return (
    <div className="App">
      <Switch>
        {Object.values(routes).map(({route}) => <Route key={route.path} {...route} />)}
      </Switch>
    </div>
  );
}

export default App;
