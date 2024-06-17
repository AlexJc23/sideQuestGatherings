import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getEvents } from '../../store/events';
import { NavLink } from 'react-router-dom';
import { groupDetails } from '../../store/groups';
import './Groups.css';

const GroupCards = ({ group }) => {
    const events = useSelector(state => state.events.allEvents);
    const eventsArr = Object.values(events);

    const groupId = group.id;
    const [groupDetailsData, setGroupDetailsData] = useState(null);

    const NumofEvents = Array.isArray(eventsArr) ? eventsArr.filter(event => event.groupId === groupId).length : 0;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getEvents());
    }, [dispatch]);

    useEffect(() => {
        const fetchGroupDetails = async () => {
            const details = await dispatch(groupDetails(groupId));
            setGroupDetailsData(details);
        };
        fetchGroupDetails();
    }, [dispatch, groupId]);

    const lastImage = groupDetailsData?.GroupImages?.length > 0
        ? groupDetailsData.GroupImages[groupDetailsData.GroupImages.length - 1].url
        : './BlueMonogramLogo.svg';

    const separateGroup = (
        <NavLink key={group.id} to={`/groups/${group.id}`} className="group-card">
            <div className="group-left">
                <img className="group-img" src={lastImage} alt="group picture" />
            </div>
            <div className="group-right">
                <h2>{group.name}</h2>
                <h3>{group.city}, {group.state}</h3>
                <p className='group-about'>{group.about}</p>
                <div className="group-btm">
                    <span>{NumofEvents} Events</span>
                    <span>· {group.type}</span>
                </div>
            </div>
        </NavLink>
    );

    return (
        <div>
            {separateGroup}
        </div>
    );
};

export default GroupCards;
