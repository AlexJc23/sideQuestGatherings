import { useParams } from "react-router-dom";
import { groupDetails } from "../../store/groups";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { createEvent } from "../../store/events";
import { FaDollarSign } from "react-icons/fa6";


const CreateEvent = () => {
    const {groupId} = useParams();

    const group = useSelector(state => state.groups.currentGroup)


    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(groupDetails(groupId))
    }, [dispatch, groupId])

    return (
        <form id="event-form">
            <section >
                <h1>Create an event for {group.name}</h1>
            </section>
            <section>
                <div>
                    <label>
                        Is this an in person or online event?
                    </label>
                    <select>
                        <option>(select one)</option>
                        <option>(In person)</option>
                        <option>(Online)</option>
                    </select>
                </div>
                <div>
                    <label>
                        Is this event private or public?
                    </label>
                    <select>
                        <option>(select one)</option>
                        <option>(Private)</option>
                        <option>(Public)</option>
                    </select>
                </div>
                <div>
                    <label>
                        What is the price for your event?
                    </label>
                    <i><FaDollarSign /></i>
                    <input type='text' />
                </div>
            </section>
            <section>
                <div>
                    <label>When does your event start?</label>
                    <input type="datetime-local" ></input>
                </div>
                <div>
                    <label>When does your event end?</label>
                    <input type="datetime-local" ></input>
                </div>
            </section>
            <section>
                <label>Please add an image url for your event below:</label>
                <input type="text"></input>
            </section>
            <section>
                <label>Please describe your event:</label>
                <textarea type="text"></textarea>
            </section>
            <button type="submit">Create Event</button>
        </form>
    )
}


export default CreateEvent;
