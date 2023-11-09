import ChatComp from './messengerComp/chatComp';
import ChatBox from './messengerComp/chatBox';
import { useContext, useEffect, useState } from 'react';
import { MenuContext, UserContext } from './Main';
import { useNavigate } from 'react-router-dom';


function Messenger() {
    const Navigate = useNavigate()
    let chatbox
    const {user,selectedFriend}=useContext(UserContext)
    const {menuOpen,setmenuOpen}=useContext(MenuContext)
    useEffect(()=>{
        if(!user){
            Navigate("/login")
        }
    },[])
    
    if(!user){
        return <p>Nothing</p>
    }
    
    if(!selectedFriend){
        chatbox=<>
        <div id='chatBox'>
            <h3>Chat Box</h3>
            <p>select someone</p>
        </div>
        </>
    }else{
        chatbox=<ChatBox user={user} key={selectedFriend._id} selectedFriend={selectedFriend}/>
    }
    return ( 
        <div className="messengerContainer">
            {/* to close portal */}
            <div style={menuOpen?{position:"absolute",width:"100vw",height:"100vh",backgroundColor:"#8080805c",zIndex:1}:{display:"none"}} onClick={()=>{setmenuOpen(false)}}></div>
            
            <ChatComp user={user} />
            {chatbox} 
        </div>
     );
}
export default Messenger;