import { useParams, useNavigate } from "react-router-dom";
import { groupDetails } from "../../store/groups";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { createEvent } from "../../store/events";
import { FaDollarSign } from "react-icons/fa6";
import './CreateEvent.css'

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
    const [systemError, setSystemError] = useState({});

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
        setSystemError({})
        const errs = {};

        if(!name || name === '') errs['name'] = 'Name is required';
        if(type === '') errs['type'] = 'Event Type is required';
        if(isPrivate === '') errs['private'] = 'Visibilty is required';
        if(price < 0) errs['price'] = 'Price is required';
        if(startDate === '') errs['startDate'] = 'Event start is required';
        if(endDate === '') errs['endDate'] = 'Event end is required';

        const fileArr = ['.png', '.jpg', '.jpeg']
        if(!fileArr.includes(url.slice(-4))) errs['url'] = 'Image URL must end in .png, .jpg, or .jpeg'

        if(about.length <= 30) errs['about'] = 'Description must be at least 30 characters long'
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
            setSystemError(response.errors);
        } else {
            navigate(`/events/${response.id}`);
        }
        setErrors(errs)
    }

    console.log('help   ',systemError)


    return (
        <form id="event-form" onSubmit={handleSubmit}>
                <h1>Create an event for {group.name}</h1>
            <section className="form-section">
                <label>What is the name of your group?</label>
                <input type="text" value={name} onChange={handleName}/>
                {errors.name && <p className="errors">{'*' + errors.name}</p>}
                {systemError.name && <p className="errors">{'*' + systemError.name}</p>}
            </section>
            <section className="form-section">
                <div className='divider'>
                    <label>
                        Is this an in person or online event?
                    </label>
                    <select type='select' value={type} onChange={handleType} >
                        <option>(select one)</option>
                        <option>In person</option>
                        <option>Online</option>
                    </select>
                    {errors.type && <p className="errors">{'*' + errors.type}</p>}
                </div>
                <div className='divider'>
                    <label>
                        Is this event private or public?
                    </label>
                    <select type='select' value={isPrivate} onChange={handleIsPrivate}>
                        <option>(select one)</option>
                        <option>Private</option>
                        <option>Public</option>
                    </select>
                    {errors.private && <p className="errors">{'*' + errors.private}</p>}
                </div>
                <div className='divider'>
                    <label>
                        What is the price for your event?
                    </label>
                    <div className="price-tag">
                    {/* <i><FaDollarSign /></i> */}
                    <input id='price' type='text' value={price} style={{width: '100px'}} onChange={handlePrice} />
                    </div>
                    {errors.price && <p className="errors">{'*' + errors.price}</p>}
                </div>
            </section>
            <section className="form-section">
                <div className='divider'>
                    <label>When does your event start?</label>
                    <input type="datetime-local"  value={startDate} onChange={handleStartDate}></input>
                    {errors.startDate && <p className="errors">{'*' + errors.startDate}</p>}
                </div>
                <div className='divider'>
                    <label>When does your event end?</label>
                    <input type="datetime-local" value={endDate} onChange={handleEndDate}></input>
                    {errors.endDate && <p className="errors">{'*' + errors.endDate}</p>}
                </div>
            </section>
            <section className="form-section">
                <label>Please add an image url for your event below:</label>
                <input type="text" value={url} onChange={handleUrl}></input>
                {errors.url && <p className="errors">{'*' + errors.url}</p>}
            </section>
            <section className="form-section">
                <label>Please describe your event:</label>
                <textarea type="text" value={about} onChange={handleAbout}></textarea>
                {errors.about && <p className="errors">{'*' + errors.about}</p>}
            </section>
            <button className='submit-btn' type="submit">Create Event</button>
        </form>
    )
}


export default CreateEvent;
