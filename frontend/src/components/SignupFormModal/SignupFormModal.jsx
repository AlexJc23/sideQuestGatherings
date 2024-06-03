import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupFormModal.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [userErrors, setUserErrors] = useState({});

  const { closeModal } = useModal();

  useEffect(() => {
    const userErr = {};
    // const

    if(!email.includes('@')) userErr['email'] = '* Enter a valid email.';
    if(username.length <=6) userErr['username'] ='* Username must be 6 characters or longer.'
    if(firstName.length <= 3) userErr['firstName'] = '* Enter your first name.';
    if(lastName.length <= 3) userErr['lastName'] = '* Enter your last name.';
    if(password.length <= 6) userErr['password'] = '* Password must be 6 Characters or more.';
    if (!password.match(/[!@#$%^&*(),.?":{}|<>]/)) userErr['password'] = '* Password must contain at least one special character';
    if(password !== confirmPassword) userErr['confirmPassword'] = '* Passwords must match.'

    setUserErrors(userErr)

  }, [email, username, firstName, lastName, password, confirmPassword])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div className='signup-form' >
       <img className='signup-img' src='/BlueLogo.svg'/>
      <h1 className='header-signup'>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <p className='errors'>{userErrors.email}</p>
        {errors.email && <p>{errors.email}</p>}
        <section className='form-input'>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <p className='errors'>{userErrors.username}</p>
        {errors.username && <p>{errors.username}</p>}
        </section>
        <section className='form-input'>
          <label>
            First Name
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
          <p className='errors'>{userErrors.firstName}</p>
          {errors.firstName && <p>{errors.firstName}</p>}
        </section>
        <section className='form-input'>
          <label>
            Last Name
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
          <p className='errors'>{userErrors.lastName}</p>
          {errors.lastName && <p>{errors.lastName}</p>}
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
          {errors.password && <p>{errors.password}</p>}
        </section>
        <section className='form-input'>
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <p className='errors'>{userErrors.confirmPassword}</p>
        </section>
        {errors.confirmPassword && (
          <p>{errors.confirmPassword}</p>
        )}
        <button disabled={Object.keys(userErrors).length} type="submit">Sign Up</button>
      </form>
    </div >
  );
}

export default SignupFormModal;
