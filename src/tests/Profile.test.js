import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndContext from './helpers/renderWithRouterAndContext';
import App from '../App';

describe('Testa a Tela de Perfil', () => {
  it('Testa se as informações aparecem na Tela de Perfil', async () => {
    const { history } = renderWithRouterAndContext(<App />);
    const email = screen.getByRole('textbox');
    const senha = screen.getByPlaceholderText(/insira sua senha/i);
    userEvent.type(email, 'teste@teste.com');
    userEvent.type(senha, '1234567');
    userEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(history.location.pathname).toBe('/meals');

    const banner = screen.getByRole('banner');

    const iconProfile = within(banner).getByRole('img', {
      name: /profile/i,
    });
    userEvent.click(iconProfile);
    expect(history.location.pathname).toBe('/profile');

    screen.getByRole('img', {
      name: /profile/i,
    });
    screen.getByRole('heading', {
      name: /profile/i,
    });
    screen.getByRole('heading', {
      name: /teste@teste\.com/i,
    });

    const favorite = screen.getByRole('button', {
      name: /favorite recipes/i,
    });
    userEvent.click(favorite);
    expect(history.location.pathname).toBe('/favorite-recipes');
    userEvent.click(screen.getByRole('img', {
      name: /profile/i,
    }));

    const logout = screen.getByRole('button', {
      name: /logout/i,
    });
    userEvent.click(logout);
    expect(history.location.pathname).toBe('/');
  });

  it('Testando Done Recipes', () => {
    const { history } = renderWithRouterAndContext(<App />, '/profile');

    const done = screen.getByRole('button', {
      name: /done recipes/i,
    });
    userEvent.click(done);
    expect(history.location.pathname).toBe('/done-recipes');
  });
});
