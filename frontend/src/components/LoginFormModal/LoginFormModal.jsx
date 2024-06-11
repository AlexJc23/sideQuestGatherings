import { useState } from 'react';
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
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    setErrors({});
    if(credential.length <= 4) errs['credential'] = '* Please enter your Username or Email';

    if(password.length <= 6) errs['password'] = '* Please enter your Password';

    setErrors(errs)

    setNewErr({});
    return dispatch(sessionActions.login({ credential, password })).then(closeModal).catch(
      async (res) => {
        const data = await res.json();
        if (data.message) setNewErr(data);
      }
    );
  };



  return (
    <div className='login-form'>
      <img className='login-img' src='/BlueLogo.svg'/>
      <h1 className='header-login'>Log In</h1>
      {newErr && <p>{newErr.message}</p>}
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

        <button disabled={Object.keys(errors).length} type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
