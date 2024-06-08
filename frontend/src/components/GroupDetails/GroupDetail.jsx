import { groupDetails } from "../../store/groups";
import { eventsArrSelector} from "../../store/events";
import { useDispatch, useSelector } from 'react-redux';

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import EventCards from "../Events/EventCards";
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


    if (!group.Organizer) {
        return null;
    }

    return (
        <>
            <div className="details">
                <GroupDetailsCard group={group} />
            <div className='details-btm'>
                <section className="Organizer">
                    <h2>Organizer</h2>
                    <span>{group.Organizer.firstName} {group.Organizer.lastName}</span>
                </section>
                <section className="details-about">
                    <h2>What we&apos;re about</h2>
                    <p>{group.about}</p>
                </section>
                {futureEvents.length ? (<><h2>Upcoming Events ({futureEvents.length})</h2><section className="future-evnts">
                {futureEvents.map(event => (


                    <EventCards key={event.id} event={event} />

                ))}
                </section></>) : (<div></div>)}
                {pastEvents.length ? (<><h2>Past Events ({pastEvents.length})</h2> <section className="past-evnts">
                {pastEvents.map(event => (
                <EventCards key={event.id} event={event} />
                ))}
                </section> </>) : (<div></div>)}
            </div>
            </div>
        </>
    );

}

export default GroupDetail;
