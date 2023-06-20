import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import context from '../context/Context';
import logo from '../images/Borcelle.png';
import '../style/Login.css';

function Login(props) {
  const { history } = props;

  const { email, setEmail } = useContext(context);
  const [password, setPassword] = useState('');

  const validateInputs = () => {
    const regex = /\w+@\w+\.\w{2,8}(\.\w{0,2})?/g;
    const validateEmail = regex.test(email);
    const minPass = 6;

    if (!(validateEmail && password.length > minPass)) return true;
  };

  const handleSubmit = () => {
    console.log(email);
    localStorage.setItem('user', JSON.stringify({ email }));
    history.push('/meals');
  };

  return (
    <section className="login">
      <img src={ logo } alt="logo" />
      <div className="input_login">
        <input
          type="email"
          value={ email.email }
          data-testid="email-input"
          onChange={ ({ target }) => setEmail(target.value) }
          placeholder="Insira seu Email"
        />
        <input
          type="password"
          value={ password }
          data-testid="password-input"
          onChange={ ({ target }) => setPassword(target.value) }
          placeholder="Insira sua Senha"
        />
        <div />
        <button
          type="button"
          data-testid="login-submit-btn"
          disabled={ validateInputs() }
          onClick={ handleSubmit }
        >
          Entrar
        </button>
      </div>
    </section>
  );
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.string,
  }),
}.isRequired;

export default Login;
