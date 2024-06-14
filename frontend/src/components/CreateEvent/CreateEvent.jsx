import { useParams, useNavigate } from "react-router-dom";
import { groupDetails } from "../../store/groups";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { createEvent } from "../../store/events";
import { FaDollarSign } from "react-icons/fa6";


const CreateEvent = () => {
    const {groupId} = useParams();

    const group = useSelector(state => state.groups.currentGroup)

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const [type, setType] = useState('');
    const [isPrivate, setIsPrivate] = useState('');
    const [price, setPrice] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [url, setUrl] = useState('');
    const [about, setAbout] = useState('');
    const [name, setName] = useState('')
    const [errors, setErrors] = useState({});

    const handleName = e => setName(e.target.value);
    const handleType = e => setType(e.target.value);
    const handleIsPrivate = e => setIsPrivate(e.target.value);
    const handlePrice = e => setPrice(e.target.value);
    const handleStartDate = e => setStartDate(e.target.value);
    const handleEndDate = e => setEndDate(e.target.value);
    const handleUrl = e => setUrl(e.target.value);
    const handleAbout = e => setAbout(e.target.value);


    useEffect(() => {
        dispatch(groupDetails(groupId))
    }, [dispatch, groupId])




    const handleSubmit = async (e) => {
        e.preventDefault();

        const errs = {};

        if(!name || name === '') errs['name'] = 'Name is required';
        if(type === '') errs['type'] = 'Event Type is required';
        if(isPrivate === '') errs['private'] = 'Visibilty is required';
        if(price === '' || typeof price !== 'number') errs['price'] = 'Price is required'

        //finish validators

        const payload = {
            groupId: groupId,
            venueId: 2,
            name,
            type,
            capacity: 50,
            price,
            description: about,
            startDate: startDate,
            endDate: endDate,
            url
        }

       const response = await dispatch(createEvent(payload, groupId));

       if(response.errors) {
            setErrors(response.errors);
       } else {
            navigate(`/events/${response.id}`);
       }
    }




    return (
        <form id="event-form" onSubmit={handleSubmit}>
                <h1>Create an event for {group.name}</h1>
            <section >
                <label>What is the name of your group?</label>
                <input type="text" value={name} onChange={handleName}/>
            </section>
            <section>
                <div>
                    <label>
                        Is this an in person or online event?
                    </label>
                    <select type='select' value={type} onChange={handleType} >
                        <option>(select one)</option>
                        <option>In person</option>
                        <option>Online</option>
                    </select>
                </div>
                <div>
                    <label>
                        Is this event private or public?
                    </label>
                    <select type='select' value={isPrivate} onChange={handleIsPrivate}>
                        <option>(select one)</option>
                        <option>Private</option>
                        <option>Public</option>
                    </select>
                </div>
                <div>
                    <label>
                        What is the price for your event?
                    </label>
                    <i><FaDollarSign /></i>
                    <input type='text' value={price} onChange={handlePrice} />
                </div>
            </section>
            <section>
                <div>
                    <label>When does your event start?</label>
                    <input type="datetime-local"  value={startDate} onChange={handleStartDate}></input>
                </div>
                <div>
                    <label>When does your event end?</label>
                    <input type="datetime-local" value={endDate} onChange={handleEndDate}></input>
                </div>
            </section>
            <section>
                <label>Please add an image url for your event below:</label>
                <input type="text" value={url} onChange={handleUrl}></input>
            </section>
            <section>
                <label>Please describe your event:</label>
                <textarea type="text" value={about} onChange={handleAbout}></textarea>
            </section>
            <button type="submit">Create Event</button>
        </form>
    )
}


export default CreateEvent;
