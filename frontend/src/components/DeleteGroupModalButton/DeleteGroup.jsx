
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

    console.log(groupId)
    return (
        <div id="delete-grp">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this group?</p>
            <button onClick={deleteGroup}>Yes (Delete Group)</button>
            <button onClick={keepGroup}>No (Keep Group)</button>
        </div>
    );
};

export default DeleteGroup;
