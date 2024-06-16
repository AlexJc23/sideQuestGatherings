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
        <NavLink to="/"><img className='nav-img' src='/monogrambluelogo.svg' alt='home logo'/></NavLink>
      </li>
      {isLoaded && sessionUser ?
      (<li>
        <ProfileButton user={sessionUser} />
      </li>) : (
        <ul className='action-btns' >
          <div className='left-actn'>
          <OpenModalMenuItem
          itemText={"Log In"}
          modalComponent={<LoginFormModal />}
          />
          </div>
          <div className='right-actn'>
          <OpenModalMenuItem
          itemText={'Sign Up'}
          modalComponent={<SignupFormModal/>}
          />
          </div>
        </ ul>
      )
    }
    </ul>
  )
}

export default Navigation;
