import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Repository from '../pages/Repository';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Dashboard} />
    {/* Usamos o sinal de mais no :repository+ para dizer que tudo que tem depois
    da barra é esse parametro */}
    <Route path="/repository/:repository+" component={Repository} />
  </Switch>
);

export default Routes;
