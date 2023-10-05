// import { useOnlinePeople } from "../../utils/reactQuery"
import {FriendList} from "./friendComps"


function ChatComp({user}) {
    return ( 
    <div>
        <h3>Chat</h3>
        
        <FriendList userID={user._id}/>
    </div>
     );
}

export default ChatComp;