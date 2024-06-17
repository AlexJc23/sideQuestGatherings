
import { useModal } from "../../context/Modal";
import { removeGroup } from "../../store/groups";
import { useDispatch } from "react-redux";

const DeleteGroup = ({groupId, navigate}) => {
    // const  {groupId}  = useParams();
    const dispatch = useDispatch();

    const { closeModal } = useModal();

    const keepGroup = (e) => {
        e.preventDefault()
        closeModal();
    };

    const deleteGroup = () => {

        dispatch(removeGroup(groupId));
        navigate("/groups");
        closeModal();
    }


    return (
        <div className="dlt-modal">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this group?</p>
            <div className="delete-btns">
                <button className="remove" onClick={deleteGroup}>Yes (Delete Group)</button>
                <button className="keep" onClick={keepGroup}>No (Keep Group)</button>
            </div>
        </div>
    );
};

export default DeleteGroup;
