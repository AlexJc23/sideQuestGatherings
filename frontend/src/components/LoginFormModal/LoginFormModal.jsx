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
  const [userErrors, setUserErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    setErrors({});
    if(credential.length <= 4) errs['credential'] = '* Please enter your Username or Email';

    if(password.length <= 6) errs['password'] = '* Please enter your Password';

    setErrors(errs)

    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };



  return (
    <div className='login-form'>
      <img className='login-img' src='/BlueLogo.svg'/>
      <h1 className='header-login'>Log In</h1>
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
          {errors.credential && ( <p className='errors'>{errors.credential}</p>)}
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
          {errors.password && ( <p className='errors'>{errors.password}</p>)}
        </section>

        <button disabled={Object.keys(userErrors).length} type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
