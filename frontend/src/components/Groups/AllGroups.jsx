import { getGroups } from "../../store/groups";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const AllGroups = () => {
    const groups = useSelector(state => state.groups.allGroups);  // Adjusted selector

    const allGroups = groups ? Object.values(groups) : [];
    // console.log(groups);

    const seperateGroup = allGroups.map((group) => (
        <NavLink key={group.id} to={`/groups/${group.id}`} className="group" >
            <div className="group-left">
                <img className="group-img" src={group.previewImage} alt="group" />
                <div className="group-btm">
                    <span>{group.type}</span>
                </div>
            </div>
            <div className="group-right">
                <h2>{group.name}</h2>
                <h3>{group.city}, {group.state}</h3>
                <p>{group.about}</p>
            </div>
        </NavLink>
    ));

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getGroups());
    }, [dispatch]);

    return (
        <div>
            {seperateGroup}
        </div>
    );
};

export default AllGroups;
