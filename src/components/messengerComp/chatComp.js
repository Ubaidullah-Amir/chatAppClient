import { useContext } from "react";
import {FriendList} from "./friendComps"
import { MenuContext } from "../Main";

function ChatComp({user}) {
    
    const {menuOpen}=useContext(MenuContext)
    return ( 
    <div  className={menuOpen?"chatComp slideChatComp":"chatComp"}>
        <FriendList userID={user._id}/>
    </div>
     );
}

export default ChatComp;