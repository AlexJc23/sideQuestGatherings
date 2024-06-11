import { groupDetails } from "../../store/groups";
import { eventsArrSelector} from "../../store/events";
import { useDispatch, useSelector } from 'react-redux';

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import EventCard from "../EventDetails/EventDetailCards";
import './GroupDetail.css'
import GroupDetailsCard from "./GroupDetailCard";

const GroupDetail = () => {
    const  {groupId}  = useParams();

    const dispatch = useDispatch();

    const group = useSelector(state => state.groups.currentGroup);

    // const reports = useSelector(reportsArraySelector);
    const events = useSelector(eventsArrSelector);
    const eventArr = Object.values(events)


    // Filter events for the specific group
    const currentGroupEvents = eventArr.filter(event => event.groupId === parseInt(groupId));

    // Separate future and past events
    const futureEvents = currentGroupEvents.filter(event => new Date(event.startDate) > new Date());
    const pastEvents = currentGroupEvents.filter(event => new Date(event.startDate) <= new Date());


    useEffect(() => {
        dispatch(groupDetails(groupId));
    }, [dispatch, groupId]);

    if(!group) return <h1>Loading...</h1>;

    if (!group.Organizer) {
        return null;
    }



    return (
        <>
            <div>
                <GroupDetailsCard group={group} />
                <div className='bottom-of-all'>
                    <div className='details-btm'>
                        <section className="Organizer">
                            <h2>Organizer</h2>
                            <p>{group.Organizer.firstName} {group.Organizer.lastName}</p>
                        </section>
                        <section className="details-about">
                            <h2>What we&apos;re about</h2>
                            <p>{group.about}</p>
                        </section>
                        {futureEvents.length ? (<><h2 className="past-future">Upcoming Events ({futureEvents.length})</h2><section className="evnts-list">
                        {futureEvents.map(event => (
                            <EventCard  key={event.id} event={event} />
                        ))}
                        </section></>) : (<h2 className="past-future">No Upcoming Events</h2>)}
                        {pastEvents.length ? (<><h2 className="past-future">Past Events ({pastEvents.length})</h2> <section className="evnts-list">
                        {pastEvents.map(event => (
                        <EventCard key={event.id} event={event} />
                        ))}
                        </section> </>) : (<div></div>)}
                    </div>
                </div >
            </div>

        </>
    );

}

export default GroupDetail;
