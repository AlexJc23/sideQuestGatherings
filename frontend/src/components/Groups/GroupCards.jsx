

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getEvents } from '../../store/events';
import { NavLink } from 'react-router-dom';
import './Groups.css';

const GroupCards = ({group}) => {
    const events = useSelector(state => state.events.allEvents);
    const eventsArr = Object.values(events);

    const groupId = group.id;

    const NumofEvents = Array.isArray(eventsArr) ? eventsArr.filter(event => event.groupId === groupId).length : 0;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getEvents())
    }, [dispatch])

    const seperateGroup = (
    <>
        <NavLink key={group.id} to={`/groups/${group.id}`} className="group-card" >
            <div className="group-left">
                <img className="group-img" src={group.previewImage} alt="group picture" />
            </div>
            <div className="group-right">
                <h2>{group.name}</h2>
                <h3>{group.city}, {group.state}</h3>
                <p className='group-about'>{group.about}</p>

            <div className="group-btm">
                    <span>{NumofEvents} Events</span>
                    <span>· {group.type}</span>
            </div>
            </div>
        </NavLink>

        <div className='spacers'></div>
    </>)

    return (
        <div>
            {seperateGroup}
        </div>
    );
};

export default GroupCards;
