import { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginFormModal.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [newErr, setNewErr] = useState({});
  const [disabled, setDisabled] = useState(true);
  const { closeModal } = useModal();

  useEffect(() => {
    if (credential.length >= 4 && password.length >= 6) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [credential, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    setErrors({});

    if (credential.length < 4) errs['credential'] = '* Please enter your Username or Email';
    if (password.length < 6) errs['password'] = '* Please enter your Password';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setNewErr({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data.message) setNewErr(data);
      });
  };

  const handleDemo = () => {
    return dispatch(sessionActions.login({ credential: 'TestUser1', password: 'password1' }))
      .then(closeModal);
  };

  return (
    <div className='login-form'>
      <img className='login-img' src='/BlueLogo.svg' />
      <h1 className='header-login'>Log In</h1>
      {newErr && <p className='errors'>{newErr.message}</p>}
      <form onSubmit={handleSubmit}>
        <section className='form-input'>
          <label className='s'>
            Username or Email
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </label>
          {errors.credential && (<p className='errors'>{errors.credential}</p>)}
        </section>
        <section className='form-input'>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.password && (<p className='errors'>{errors.password}</p>)}
        </section>

        <button disabled={disabled} type="submit">Log In</button>
        <button onClick={handleDemo} type="button">Demo Log In</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
