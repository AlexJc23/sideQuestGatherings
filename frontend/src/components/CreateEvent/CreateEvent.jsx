import { useParams } from "react-router-dom";
import { groupDetails } from "../../store/groups";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const CreateEvent = () => {
    const {groupId} = useParams();

    const group = useSelector(state => state.groups.currentGroup)
    // console.log(group)

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(groupDetails(groupId))
    }, [dispatch, groupId])

    return (
        <form>
            <h1>hello world</h1>
        </form>
    )
}


export default CreateEvent;
