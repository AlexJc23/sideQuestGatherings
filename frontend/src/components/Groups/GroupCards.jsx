

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
// import { groupDetails } from '../../store/groups';
import { getEvents } from '../../store/events';

import { NavLink } from 'react-router-dom';

const GroupCards = ({group}) => {
    const dispatch = useDispatch();
    const events = useSelector(state => state.events.allEvents);
    const eventsArr = Object.values(events);
    console.log('events   ', eventsArr);
    const groupId = group.id;
    const NumofEvents = Array.isArray(eventsArr) ? eventsArr.filter(event => event.groupId === groupId).length : 0;
    console.log(NumofEvents)
    useEffect(() => {
        dispatch(getEvents())
    }, [dispatch])

    const seperateGroup = (
        <NavLink key={group.id} to={`/groups/${group.id}`} className="group" >
            <div className="group-left">
                <img className="group-img" src={group.previewImage} alt="group" />
            </div>
            <div className="group-right">
                <h2>{group.name}</h2>
                <h3>{group.city}, {group.state}</h3>
                <p>{group.about}</p>

            </div>
            <div className="group-btm">
                    <span>{NumofEvents} Events</span>
                    <span>{group.type}</span>
            </div>
        </NavLink>)

    return (
        <div>
            {seperateGroup}
        </div>
    );
};

export default GroupCards;
