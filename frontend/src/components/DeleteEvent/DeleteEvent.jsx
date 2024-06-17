
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { removeEvent } from "../../store/events";
import './DeleteEvent.css'

const DeleteEvent = ({eventId, navigate, groupId}) => {
    const dispatch = useDispatch();

    const { closeModal } = useModal();

    const keepEvent = (e) => {
        e.preventDefault()
        closeModal();
    };

    const deleteEvent = () => {

        dispatch(removeEvent(eventId));
        navigate(`/groups/${groupId}`);
        closeModal();
    }

    console.log(eventId)
    return (
        <div className="dlt-modal">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this Event?</p>
            <div className="delete-btns">
                <button className="remove" onClick={deleteEvent}>Yes (Delete Event)</button>
                <button  className="keep" onClick={keepEvent}>No (Keep Event)</button>
            </div>
        </div>
    );
};

export default DeleteEvent;
