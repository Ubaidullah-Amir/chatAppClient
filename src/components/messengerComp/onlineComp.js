import {FriendList} from "./friendComps"
const onlineList=[
    "huzaifa","Umer"
]

function OnlineComp({user_id}) {
    return ( 
    <div>
        <h3>Online</h3>
        {/* <FriendList peopleList={onlineList}/> */}
    </div>
     );
}

export default OnlineComp;