import {NavLink} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import GroupCards from './groupcards';
import { useEffect } from 'react';
import { getGroups } from "../../store/groups";
import './Groups.css'

const GroupMain = () => {

    const groups = useSelector(state => state.groups.allGroups);

    const allGroups = groups ? Object.values(groups) : [];


    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getGroups());
    }, [dispatch]);
    return (
        <div className='group-event-main'>
            <div className='group-event-header'>
                <NavLink className='events-head' to={'/events'}>Events</NavLink>
                <NavLink className='groups-head' to={'/groups'}>Groups</NavLink>
            </div>
            <div className='group-event-subheader'>
                <p>Groups in S.Q.G.</p>
            </div>
            <div className='spacer1'></div>
            <div className='cards'>
            {allGroups.map(group => (
                <GroupCards key={group.id} group={group} />
                ))}

            </div>

        </div>
    )
}

export default GroupMain;
