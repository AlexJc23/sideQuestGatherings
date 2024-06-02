import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);




  return (
    <ul className='nav-bar' >
      <li >
        <NavLink to="/">Home</NavLink>
      </li>
      {isLoaded && sessionUser ?
      (<li>
        <ProfileButton user={sessionUser} />
      </li>) : (
        <div >
          <OpenModalMenuItem
          itemText={"Log In"}
          modalComponent={<LoginFormModal />}
          />
          <OpenModalMenuItem
          itemText={'Sign Up'}
          modalComponent={<SignupFormModal/>}
          />
        </ div>
      )
    }
    </ul>
  )
}

export default Navigation;
