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
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  useEffect(() => {
    const errs = {};
    if(credential.length <= 3) errs['credential'] = '* Please enter your Username or Email';

    if(password.length <= 3) errs['password'] = '* Please enter your Password';

    setUserErrors(errs)
  }, [credential, password])

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
          <p className='errors'>{userErrors.credential}</p>
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
          <p className='errors'>{userErrors.password}</p>
        </section>
        {errors.credential && (
          <p>{errors.credential}</p>

        )}
        <button disabled={Object.keys(userErrors).length} type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
