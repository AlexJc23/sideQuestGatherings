import { NavLink } from 'react-router-dom';
import { eventDetails } from '../../store/events';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

const EventCards = ({ event }) => {
    const eventDetail = useSelector(state => state.events.currentEvents[event.id]);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!eventDetail) {
            dispatch(eventDetails(event.id));
        }
    }, [dispatch, event.id, eventDetail]);

    console.log('Event Detail:', eventDetail);

    return (
        <>
            <NavLink key={event.id} to={`/events/${event.id}`} className="event-card">
                <div className='event-card-top'>
                    <div className="event-left">
                        <img className="event-img" src={event.previewImage} alt="event picture" />
                    </div>
                    <div className="event-right">
                        <h3>{event.startDate}</h3>
                        <h2>{event.name}</h2>
                        <p>{event.Venue.city}, {event.Venue.state}</p>
                    </div>
                </div>
                    <div className="event-card-btm">
                        <span className='event-about'>{eventDetail ? eventDetail.description : 'Loading description...'}</span>
                    </div>
            </NavLink>
            <div className='spacers'></div>
        </>
    );
};

export default EventCards;
