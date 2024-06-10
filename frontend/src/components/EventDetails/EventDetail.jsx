import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { eventDetails } from '../../store/events';
import { eventDetailSelector } from '../../store/events';
import { IoChevronBack } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";
import { CiDollar } from "react-icons/ci";
import { FaMapPin } from "react-icons/fa";
import { groupDetails } from '../../store/groups';
import './EventDetail.css'

const EventDetail = () => {
    const { eventId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Selector to get event details from state
    const selectEvent = eventDetailSelector(eventId);
    const event = useSelector(selectEvent);




    useEffect(() => {
        dispatch(eventDetails(eventId));
    }, [dispatch, eventId]);

    //grab the groupId
    const groupId = event ? event.groupId : null;

    // //selector to get current group for current event
    const currentGroup = useSelector(state => state.groups.currentGroup);


    useEffect(() => {
        dispatch(groupDetails(groupId))
    }, [dispatch, groupId])

    if (!event) return <h1>Loading...</h1>;


    const eventImages = event.EventImages.filter(event => event.preview === true);

    const groupImages = currentGroup.GroupImages ?currentGroup.GroupImages.filter(images => images.preview === true) : null;
    const startTime = event.startDate.split(' ');
    const endTime = event.endDate.split(' ');


    const handleGoBack = () => {
        navigate('/events')
    };

    return (
        <div className='evnts-backgrn'>

        <div className='details-events'>
            <section className='event-details-top'>
                <button className="back-btn" onClick={handleGoBack}><IoChevronBack /> Events</button>
                <h1>{event.name}</h1>
                {currentGroup.Organizer ? <h3> Hosted by {currentGroup.Organizer.firstName} {currentGroup.Organizer.lastName}</h3> : <h3>Loading...</h3>}
            </section>
            <section className='events-mid'>
                <div className='mid-left'>
                    {!eventImages.length ? <img className='event-image' src='../BlueMonogramLogo.svg'/> : <img className='event-image' src= {eventImages[0].imageUrl}/>}
                </div>
                <div className='mid-right'>
                    <NavLink to={`/groups/${currentGroup.id}`} className='event-group'>
                        <div className='evnt-grp-lft'>
                            {groupImages ? <img className="grp-img" src={groupImages[0].url} alt='Group Image'/> : <img className="grp-img" src='../BlueMonogramLogo.svg'/>}
                        </div>
                        <div className='evnt-grp-rt'>
                            <h3>{currentGroup.name}</h3>
                            {!currentGroup.private === true ? <h3>Public</h3> : <h3>Private</h3>}
                        </div>
                    </NavLink>

                    <div className='evnt-details'>
                            <div className='icons-event-details'>
                                <IoMdTime style={{fontSize: '2rem', color: '#FAB955'}}/>
                                <div >

                                    <p>START <span className='time-dates'>{startTime[0]} · {startTime[1]}</span></p>
                                    <p>END <span className='end time-dates'>{endTime[0]} · {endTime[1]}</span></p>
                                </div>
                            </div>
                        <div className='icons-event-details'>
                            <CiDollar style={{fontSize: '2rem', color: '#FAB955'}}/>
                            {event.price === 0 ? <p className='evnt-detail'>FREE</p> : <p className='evnt-detail'>${event.price}</p>}
                        </div>
                        <div className='icons-event-details'>
                            <FaMapPin style={{fontSize: '2rem', color: '#FAB955'}}/>
                            <p className='evnt-detail'>{event.type}</p>
                        </div>
                    </div>
                </div>
            </section>
            <div className='evnt-details-btm'>
                <h1>Details</h1>
                <p>{event.description}</p>
            </div>
        </div>
        </div>
    );
};

export default EventDetail;
