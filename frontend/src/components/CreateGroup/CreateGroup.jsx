import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createGroup } from '../../store/groups';

const CreateGroup = () => {
    const { user } = useSelector(state => state.session)
    console.log(user)
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [type, setType] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [url, setUrl] = useState('')

    const [errors, setErrors] = useState({});

    const handleName = e => setName(e.target.value);
    const handleCity = e => setCity(e.target.value);
    const handleState = e => setState(e.target.value);
    const handleAbout = e =>setAbout(e.target.value);
    const handleType = e =>setType(e.target.value);
    const handleIsPrivate = e =>setIsPrivate(e.target.value);
    const handleUrl = e =>setUrl(e.target.value);


    const handleGroupSubmit = e => {
        e.preventDefault();
        const formValidationErrs = {};

        

        const groupPayload = {
            organizerId: user.id,
            name,
            about,
            type,
            private: isPrivate,
            city,
            state,
            url
        };


    }

    return (
        <form id="group-form" onSubmit={handleGroupSubmit}>
            <section>
                <p>BECOME AN ORGANIZER</p>
                <h3>We&apos;ll walk you through a few steps to build your local community</h3>
            </section>
            <section className="form-section">
                <h3>First, set your group&apos;s location.</h3>
                <p>Side Quest Gatherings groups meet locally, in person and online. We&apos;ll connect you with people in your area, and more can join you online.</p>
                <div>
                    <input type="text" value={city} onChange={handleCity} placeholder="City" />
                    <input type="text" value={state} onChange={handleState} placeholder="State" />
                </div>
            </section>
            <section className="form-section">
                <h3>What will your group&apos;s name be?</h3>
                <p>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
                <div>
                    <input type="text" value={name} onChange={handleName} placeholder="What is the name of your group?" />
                </div>
            </section>
            <section className="form-section">
                <h3>Now describe what your group will be about</h3>
                <p>People will see this when we promote your group, but you&apos;ll be able to add to it later, too.</p>
                <ol>
                    <li>What&apos;s the purpose of the group?</li>
                    <li>Who should join?</li>
                    <li>What will you do at your events?</li>
                </ol>
                <div>
                    <textarea type="text" value={about} onChange={handleAbout} placeholder="Please write at least 30 characters" />
                </div>
            </section>
            <section className="form-section">
                <h3>Final steps...</h3>
                <div>
                    <label>
                        Is this an in person or online group?
                    </label>
                    <select value={type} onChange={handleType}>
                        <option >(select one)</option>
                        <option >Online</option>
                        <option >In person</option>
                    </select>
                </div>
                <div>
                    <label>
                        Is this group private or public?
                    </label>
                    <select value={isPrivate} onChange={handleIsPrivate}>
                        <option >(select one)</option>
                        <option >Private</option>
                        <option >Public</option>
                    </select>
                </div>
                <div>
                    <label>
                        Please add an image url for your group below.
                    </label>
                    <input type='text' value={url} onChange={handleUrl} placeholder="Image Url"></input>
                </div>
            </section>

            <button>Create Group</button>
        </form>
    )
}

export default CreateGroup;
