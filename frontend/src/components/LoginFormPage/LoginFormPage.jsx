import { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

//css - styling
import './LoginForm.css'



function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [pageErrors, setPageErrors] = useState({})

  useEffect(() => {
    const err = {};

    if(credential.length < 3) err['credential'] = '* Username/Email is required.';
    if(password.length < 3) err['password'] = '* Password is required.'

        setPageErrors(err)
  }, [password, credential])

  const handleSubmit = (e) => {
    e.preventDefault();



    setErrors({});
    return dispatch(sessionActions.login({ credential, password })).catch(
        async (res) => {
            const data = await res.json();
            if (data.errors) setErrors(data.errors);
        }
        );
    };

    if (sessionUser) {
        return <Navigate to="/" replace={true} />
    } else {
        return (
            <div id='login-form'>
            <h1>Log In</h1>
            <form id='login-form' onSubmit={handleSubmit}>
                <section>
                    <label>
                    Username or Email
                    </label>
                    <input
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                        />
                    <p className='required-fields'>{pageErrors.credential}</p>
                </section>
                <section>

                <label>
                Password
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                <p className='required-fields'>{pageErrors.password}</p>
                </section>
                {errors.credential && <p>{errors.credential}</p>}
                <button type="submit" disabled={Object.values(pageErrors).length}>Log In</button>
            </form>
            </div>
        );
    }
}

export default LoginFormPage;
