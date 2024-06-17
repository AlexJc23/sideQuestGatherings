import { NavLink } from "react-router-dom";
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import './LandPage.css';
import SignupFormModal from "../SignupFormModal";

import { useSelector } from "react-redux";



const LandingPage = () => {

    const user = useSelector(state => state.session.user);

    const joinGroup = !user ? '' : 'none';

    return (
        <div className="landing">
            <div className='sect1'>
                <div className='sect1-left'>
                    <h1>The people platform— Where interests become friendships</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus. Malesuada nunc vel risus commodo viverra. Tincidunt ornare massa eget egestas purus. Tellus integer feugiat scelerisque varius morbi enim nunc faucibus a. Pellentesque nec nam aliquam sem.</p>
                </div>
                <div className='sect1-right'>
                    <img className='connect-img' src='/connect.png' alt='connect image' />
                </div>
            </div>
            <div className='sect2'>
                <h2>How Side Quest gatherings works</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus.</p>
            </div>
            <div className='sect3'>
                <div className='sect3-sqr'>
                    <img src='/highfivegroup.png'/>
                    <NavLink to="/groups" className='sect3-navlink'>
                        See all groups
                    </NavLink>
                    <p>
                    consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus.
                    </p>
                </div>
                <div className='sect3-sqr'>
                    <img src='/events.png'/>
                    <NavLink to="/events" className='sect3-navlink'>
                        Find an event
                    </NavLink>
                    <p>
                    consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus.
                    </p>
                </div>
                <div className='sect3-sqr'>
                    <img src='/creategroup.png'/>
                    {user ? (
                        <NavLink to="/groups/new" className='sect3-navlink'>
                            Start a new group
                        </NavLink>
                    ) : (
                        <span className='sect3-navlink disabled'>
                            Start a new group
                        </span>
                    )}
                    <p>
                    consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus.
                    </p>
                </div>
            </div>
            <div className="sctn4" style={{display: `${joinGroup}`}}>
                <OpenModalButton
                    buttonText={'Join Side Quest Gatherings'}
                    modalComponent={<SignupFormModal />}
                />
            </div>
        </div>
    )
}

export default LandingPage;
