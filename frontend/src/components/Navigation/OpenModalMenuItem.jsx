//The OpenModalMenuItem component code should look exactly like the OpenModalButton component code except:

// change the buttonText prop to itemText
// change the onButtonClick prop to onItemClick

import { useModal } from "../../context/Modal";

const OpenModalMenuItem = ({modalComponent,
    itemText,
    onitemClick,
    onModalClose}) => {

        const {setModalContent, setOnModalClose} = useModal();

        const onClick = () => {
            if(onModalClose) setModalContent(onModalClose);
            setModalContent(modalComponent);
            if(typeof onitemClick === 'function') onitemClick();
        }
    return (
    <li onClick={onClick}>{itemText}</li>
    );
}


export default OpenModalMenuItem;
