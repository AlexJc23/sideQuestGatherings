import {Link} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import GroupCards from './groupcards';
import { useEffect } from 'react';
import { getGroups } from "../../store/groups";
import './Groups.css'

const GroupMain = () => {

    const groups = useSelector(state => state.groups.allGroups);

    const allGroups = groups ? Object.values(groups) : [];
    console.log(allGroups);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getGroups());
    }, [dispatch]);
    return (
        <div className='group-event-main'>
            <div className='group-event-header'>
                <Link className='events-head' to={'/events'}>Events</Link>
                <Link className='groups-head' to={'/groups'}>Groups</Link>
            </div>
            <div className='group-event-subheader'>
                <p>Groups in Side Quest Gatherings</p>
            </div>
            <div className='cards'>
            {allGroups.map(group => (
                <GroupCards key={group.id} group={group} />
            ))}
            </div>
        </div>
    )
}

export default GroupMain;
