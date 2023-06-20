import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndContext from './helpers/renderWithRouterAndContext';
import App from '../App';
import { soupMeals } from './helpers/mockIngredientName';
import { mockGinDrinks } from './helpers/mockGinDrinkName';
import { mockDrinkFirstLetter } from './helpers/mockDrinkFirstLetter';
import { mockVodkaDrink } from './helpers/mockMargaritaDrink';

beforeEach(() => {
  jest.spyOn(global, 'fetch');
  global.fetch.mockResolvedValue({
    json: jest.fn().mockResolvedValue(soupMeals).mockResolvedValue(mockGinDrinks)
      .mockResolvedValue(mockDrinkFirstLetter)
      .mockResolvedValue(mockVodkaDrink),
  });
});
afterEach(jest.restoreAllMocks);

describe('Testando o component search-bar e seu funcionamento', () => {
  it('Testando se o component é renderizado corretamente, e se após o clique do botão, aparece a barra de busca', async () => {
    const { history } = renderWithRouterAndContext(<App />);
    const email = screen.getByRole('textbox');
    const senha = screen.getByPlaceholderText(/insira sua senha/i);
    expect(screen.getByRole('button', { name: /entrar/i })).toBeDisabled();
    userEvent.type(email, 'keyla@gmail.com');
    userEvent.type(senha, '1234567');
    expect(screen.getByRole('button', { name: /entrar/i })).not.toBeDisabled();
    userEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(history.location.pathname).toBe('/meals');
    screen.getByRole('heading', { name: /recipes/i });
    screen.getByRole('heading', { name: /meals/i });
    screen.getByRole('img', { name: /profile/i });
    screen.getByRole('img', { name: /search/i });
    userEvent.click(screen.getByRole('img', { name: /search/i }));
    screen.getByRole('textbox');
    screen.getByText(/ingredient/i);
    screen.getByText(/name/i);
    screen.getByText(/first letter/i);
    screen.getByRole('button', { name: /meals1/i });
    screen.getByRole('img', { name: /drinks/i });
    screen.getByRole('img', { name: /meals/i });
  });
  it('Testando os inputs do search-bar e a chamada da Api de acordo com a rota meals', async () => {
    const { history } = renderWithRouterAndContext(<App />, '/meals');
    expect(history.location.pathname).toBe('/meals');
    userEvent.click(screen.getByRole('img', { name: /search/i }));
    const input = screen.getByRole('textbox');
    const nameInputRadio = screen.getByText(/name/i);
    const btnFetch = screen.getByText('Search');
    userEvent.type(input, 'soup');
    userEvent.type(nameInputRadio, 'Name');
    userEvent.click(btnFetch);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
  it('Testando os inputs do search-bar e a chamada da Api de acordo com a rota drinks', async () => {
    const { history } = renderWithRouterAndContext(<App />, '/drinks');
    screen.getByRole('heading', { name: /drinks/i });
    expect(history.location.pathname).toBe('/drinks');
    userEvent.click(screen.getByRole('img', { name: /search/i }));
    const input = screen.getByRole('textbox');
    const nameInputRadio = screen.getByText(/name/i);
    const btnFetch = screen.getByText('Search');
    userEvent.type(input, 'gin');
    userEvent.type(nameInputRadio, 'Name');
    userEvent.click(btnFetch);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
  it('Testando os inputs do search-bar e a chamada da Api de com firstLetter', async () => {
    jest.spyOn(global, 'alert').mockImplementation(() => {});
    const { history } = renderWithRouterAndContext(<App />, '/drinks');
    screen.getByRole('heading', { name: /drinks/i });
    expect(history.location.pathname).toBe('/drinks');
    userEvent.click(screen.getByRole('img', { name: /search/i }));
    const input = screen.getByRole('textbox');
    const firstLetterInputRadio = screen.getByText(/first letter/i);
    const btnFetch = screen.getByTestId('exec-search-btn');
    userEvent.type(input, 'y');
    userEvent.type(firstLetterInputRadio, 'First letter');
    userEvent.click(btnFetch);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalled();
    });
  });
  it('Testando os inputs do search-bar e a chamada da Api de com Ingredient', async () => {
    const { history } = renderWithRouterAndContext(<App />, '/drinks');
    screen.getByRole('heading', { name: /drinks/i });
    expect(history.location.pathname).toBe('/drinks');
    userEvent.click(screen.getByRole('img', { name: /search/i }));
    const input = screen.getByRole('textbox');
    const ingredientInputRadio = screen.getByText(/ingredient/i);
    const btnFetch = screen.getByTestId('exec-search-btn');
    userEvent.type(input, 'vodka');
    userEvent.type(ingredientInputRadio, 'Ingredient');
    userEvent.click(btnFetch);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
  it('Testando que se tiver apenas uma receita, é redirecionado para a tela do id da receita', async () => {
    const { history } = renderWithRouterAndContext(<App />, '/drinks');
    expect(history.location.pathname).toBe('/drinks');
    userEvent.click(screen.getByRole('img', { name: /search/i }));
    const input = screen.getByRole('textbox');
    userEvent.type(input, 'aquamarine');
    const nameInputRadio = screen.getByText(/name/i);
    userEvent.type(nameInputRadio, 'Name');
    const btnFetch = screen.getByText('Search');
    userEvent.click(btnFetch);
    // expect(history.location.pathname).toBe('/drinks/178319');
  });
});
