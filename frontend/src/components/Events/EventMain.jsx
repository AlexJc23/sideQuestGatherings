import {NavLink} from 'react-router-dom'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEvents } from '../../store/events';
import EventCards from './EventCards';

import './Events.css'

const EventMain = () => {

    const events = useSelector(state => state.events.allEvents);

    const allEvents = events ? Object.values(events) : [];

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getEvents());
    }, [dispatch]);

    return (
        <div className='group-event-main'>
            <div className='group-event-header'>
                <NavLink className='events-hd' to={'/events'}>Events</NavLink>
                <NavLink className='groups-hd' to={'/groups'}>Groups</NavLink>
            </div>
            <div className='group-event-subheader'>
                <p>Events in S.Q.G.</p>
            </div>
            <div className='spacer1'></div>
            <div className='cards'>
            {allEvents.map(event => (
                <EventCards key={event.id} event={event} />
                ))}
                
            </div>
        </div>
    )
}

export default EventMain;
