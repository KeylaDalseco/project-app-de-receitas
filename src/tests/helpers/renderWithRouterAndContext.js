import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import Provider from '../../context/Provider';

function renderWithRouterAndContext(component, path = '/') {
  const history = createMemoryHistory({ initialEntries: [path] });
  return {
    ...render(
      <Router history={ history }>
        <Provider>
          {component}
        </Provider>
      </Router>,
    ),
    history,
  };
}

export default renderWithRouterAndContext;
