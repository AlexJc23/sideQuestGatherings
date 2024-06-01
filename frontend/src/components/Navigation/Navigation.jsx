import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
// import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';


function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);


  const sessionLinks = sessionUser ? (
    <>
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    </>
  ) : (
    <>
      <li>
        <OpenModalButton
            buttonText='Log In'
            modalComponent={<LoginFormModal />}
        />
      </li>
      <li>
        <OpenModalButton
        buttonText={'Sign Up'}
        modalComponent={<SignupFormModal />}
        />
      </li>
    </>
  );

  return (
    // <nav className='nav-bar'>
    <ul className='yeet'>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
    // </nav>
  );
}

export default Navigation;
