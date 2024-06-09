import { NavLink } from 'react-router-dom';
import { eventDetails } from '../../store/events';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

const EventCard = ({ event }) => {
    const eventDetail = useSelector(state => state.events.currentEvents[event.id]);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!eventDetail) {
            dispatch(eventDetails(event.id));
        }
    }, [dispatch, event.id, eventDetail]);



    return (
        <>
            <NavLink key={event.id} to={`/events/${event.id}`} className="evnt-cards">
                <div className='card-top'>
                    <div className="card-left">
                        <img className="card-img" src={event.previewImage} alt="event picture" />
                    </div>
                    <div className="card-right">
                        <h3>{event.startDate}</h3>
                        <h2>{event.name}</h2>
                        <p>{event.Venue.city}, {event.Venue.state}</p>
                    </div>
                </div>
                    <div className="card-card-btm">
                        <span className='card-about'>{eventDetail ? eventDetail.description : 'Loading description...'}</span>
                    </div>
            </NavLink>

        </>
    );
};

export default EventCard;
