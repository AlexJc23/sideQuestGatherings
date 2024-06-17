
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { removeEvent } from "../../store/events";


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
        <div id="delete-grp">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this Event?</p>
            <button onClick={deleteEvent}>Yes (Delete Event)</button>
            <button onClick={keepEvent}>No (Keep Event)</button>
        </div>
    );
};

export default DeleteEvent;
