import { getEvents } from "../../store/events";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { IoChevronBack } from "react-icons/io5";
import { NavLink, useNavigate } from 'react-router-dom';

const GroupDetailsCard = ({ group }) => {

    const {user} = useSelector(state => state.session);
    console.log(user)

    const events = useSelector(state => state.events.allEvents);
    const eventArr = Object.values(events);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const NumofEvents = Array.isArray(eventArr) ? eventArr.filter(event => event.groupId === group.id).length : 0;

    useEffect(() => {
        dispatch(getEvents());
    }, [dispatch]);

    const handleGoBack = () => {
        navigate('/groups')
    };


    if (!group) {
        return null;
    }



    if ( group.GroupImages.length === 0) {

        return <img className="detail-img" src='../BlueMonogramLogo.svg' alt="group picture" />;
    }

    const groupCard = (
        <div className="details-card">
            <div className="detail-left">
            <button className="back-btn" onClick={handleGoBack}><IoChevronBack /> back</button>
                {group.GroupImages[0].url ? (
                    <img className="detail-img" src={group.GroupImages[0].url} alt="group picture" />
                ) : (
                    <img className="detail-img" src='./BlueMonogramLogo.svg' alt="group picture" />
                )}
            </div>
            <div className="detail-right">
                <h2>{group.name}</h2>
                <h3>{group.city}, {group.state}</h3>
                <div className="detail-num-events">
                    <span>{NumofEvents} Events</span>
                    <span>· {group.type}</span>
                </div>
                <div className="group-organizer">
                    <span>Organized by {group.Organizer.firstName} {group.Organizer.lastName}</span>
                </div>
                <div className='join-group-btn' >
                <NavLink to={`/events/new`} style={{visibility: ''}}><button className="create-event-btn" >Join Group</button></NavLink>
                <NavLink to={`/events/new`} style={{visibility: ''}}><button className="create-event-btn" >Create Event</button></NavLink>
                <NavLink to={`/events/new`} style={{visibility: ''}}><button className="create-event-btn" >Update</button></NavLink>
                <NavLink to={`/events/new`} style={{visibility: ''}}><button className="create-event-btn" >Delete</button></NavLink>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {groupCard}
        </>
    );
}

export default GroupDetailsCard;
