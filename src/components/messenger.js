import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ChatComp from './messengerComp/chatComp';
import OnlineComp from "./messengerComp/onlineComp"
import ChatBox from './messengerComp/chatBox';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from './Main';
import { useNavigate } from 'react-router-dom';



function Messenger() {
    const Navigate = useNavigate()
    let chatbox
    const {user,selectedFriend,setSelectedFriend}=useContext(UserContext)
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
        <div className='chat-box'>
            <h3>Chat Box</h3>
            <p>select someone</p>
        </div>
        </>
    }else{
        chatbox=<ChatBox user={user} selectedFriend={selectedFriend}/>
    }
    return ( 
        <div className="gridContainer">
            <Row>
                <Col className='grid_item grid_item_friends' xs={3} md={3}>
                    <ChatComp user={user} />
                </Col>
                <Col className='grid_item grid_item_chat' xs={9} md={6}>

                    {chatbox} 

                </Col>
                <Col className='grid_item grid_item_online' xs={12}  md={3}>
                    <OnlineComp user={user} setSelectedFriend={setSelectedFriend}/>
                </Col>
            </Row>
        </div>
     );
}
export default Messenger;