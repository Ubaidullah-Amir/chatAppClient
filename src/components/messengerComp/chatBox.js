import { Button } from "react-bootstrap";
import { useConversation } from "../../utils/reactQuery";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { UserContext } from "../Main";
const baseURL=process.env.REACT_APP_API_URL

function funcPostMsg(req_obj) {
    return axios.post(`${baseURL}/chat/add_msg`,req_obj)
}
function deleteConversation(id) {
    console.log("id",id)
    return axios.post(`${baseURL}/chat/deleteConversation`,{id})
}

function ChatBox({user,selectedFriend}) {
    const queryClient=useQueryClient()
    const {socket}=useContext(UserContext)
    const [ownMessages, setOwnMessages] = useState([])
    const [RecievedMessages, setRecievedMessages] = useState([])
    const [DisplayMessageArr, setDisplayMessageArr] = useState([])
    // since inside of socket events the selectedFriend is not updating hence using useRef and useContext not working in events
    const refSelectedFriend = useRef(0)
    refSelectedFriend.current = selectedFriend
   // msg input state
    const [inputValue,setInputValue]=useState("")
    // user currently typing 
    const [isTyping,setIsTyping]=useState(false)
    // msg send post request
    const {mutate,isError:isErrorSendMsgApi}=useMutation({mutationFn:funcPostMsg,
        onSuccess:(data)=>{
          console.log("msg send successfully sent",data.data)
        },
        onError:(error)=>{
            console.log(" error in sending message",error)
        }
    })
    const {mutate:deleteChat,isError:isErrorDeleteMsgApi}=useMutation({mutationFn:deleteConversation,
        onSuccess:(data)=>{
            queryClient.invalidateQueries(`conversation-${selectedFriend._id}`)
            console.log("conversation deleted")
        },
        onError:(error)=>{
            console.log(" error in deleting chat",error)
        }
    })
    function onSuccessUseConversation(){
        console.log("conversation fetched")
        setRecievedMessages([])
        setOwnMessages([])
        // second Approch
        setDisplayMessageArr([])
    }
    const {isLoading,data,isError,isFetching}=useConversation(user._id,selectedFriend._id,onSuccessUseConversation)
    useEffect(() => {
        const eventListener = (msg)=>{
            console.log("message recienved from client",msg)
            const selectedFriend = refSelectedFriend.current
            if(selectedFriend._id === msg.from){
                setRecievedMessages((prevState)=>([...prevState,msg]))
                // second Approch
                const msg_obj={...msg,sent:false}
                setDisplayMessageArr((prevState)=>([...prevState,msg_obj]))
            }
            
        }
        socket.on("recieve-message", eventListener);
    
        return () => socket.off("recieve-message", eventListener);
      }, [socket]);
      useEffect(() => {
        const eventListener = (typingFor)=>{
            const selectedFriend = refSelectedFriend.current
            console.log("typingFor",typingFor,selectedFriend)
            if(selectedFriend._id === typingFor){
                console.log("typing set to true")
                setIsTyping((prevState)=>(true))
            }
            
        }
        socket.on("recieve-user-typing", eventListener);
        
        return () => socket.off("recieve-user-typing", eventListener);
      }, [socket]);

    useEffect(() => {
      if(isTyping){
        setTimeout(() => {
            setIsTyping(false)
        }, 2000);
      }
    }, [isTyping])
    
    if(isLoading){
        return <p>Loading Chat ...</p>
    }
    if(isErrorSendMsgApi){
        return <p>Message Wasn't Sent.Try Again.</p>
    }
    if(isErrorDeleteMsgApi){
        return <p>Message Wasn't Sent.Try Again.</p>
    }
    if(isError){
        return <p>Unexpected Error occured</p>
    }
    // console.log("ownMsgArr",ownMessages)
    // console.log("recievedMsg",RecievedMessages)
    return ( 
        <div id="chatBox">
            <h3>{selectedFriend.name}{isTyping ?<span> (typing)</span>:<></>}</h3>
            <Button onClick={()=>{
                const confirmText= "Do you want to delete Chat.\n NOTE: For transparency reasons deleting chat deletes it from both sides.Do you wish to continue?"
                const confirm = window.confirm(confirmText);
                // 
                if(confirm){
                    deleteChat(data.chat._id)
                }
                }}>Clear chat</Button>
            <div >
                {/* RecievedMessages &&  ownMessages are not used are combined with DisplayMessageArr */}
                    <MessageContainer 
                    DisplayMessageArr={DisplayMessageArr}
                    RecievedMessages={RecievedMessages} 
                    ownMessages={ownMessages} 
                    messages={data.chat.conversation}/>
             

                    <form onSubmit={(e)=>{
                        e.preventDefault()
                        
                        if(!isLoading & !isError){
                            const req_body={
                                chat_id:data.chat._id,
                                msg_obj:{
                                    to:selectedFriend._id,
                                    from:user._id,
                                    text:inputValue
                                }
                            }
                            // to server
                            mutate(req_body)
                            // websocket 
                            console.log("message sent from client")
                            socket.emit("send-message",req_body)
                        }
                        const msg_obj={
                            text:inputValue,
                            sent:true
                        }
                        setOwnMessages((pervState)=>([...pervState,msg_obj]))
                        // second Approch
                        setDisplayMessageArr((prevState)=>([...prevState,msg_obj]))
                        // clear input bar
                        setInputValue("")
                    }} className="input_container">
                    <input value={inputValue} onChange={(e)=>{
                        setInputValue(e.target.value)
                        socket.emit("user-typing",{userID:user._id ,selectedFriendID:selectedFriend._id})
                        }} placeholder="message"/>
                    <Button type="submit"> Send</Button>
                    </form>
            </div>
        </div>
     );
}


function MessageContainer({messages,RecievedMessages,ownMessages,DisplayMessageArr}) {
    // console.log("DisplayMessageArr",DisplayMessageArr)
    const {user}=useContext(UserContext)
    useEffect(() => {
        scrollBottom();
    }, []);
    function scrollBottom(){
        if(!scrollDiv.current){
            return
        }
        scrollDiv.current.scrollTop = scrollDiv.current.scrollHeight
    }
    const scrollDiv=useRef()
    return ( <><div ref={scrollDiv} className="message_container">
    
    {messages.map((msg)=>{
        if(msg.from===user._id){
            // user send message
            return <Message key={msg._id} text={msg.text} sent={true}/>
        }
        return <Message key={msg._id} text={msg.text} sent={false}/>
    })
    }
    {
        DisplayMessageArr.map((msg,index)=>{
            return <Message key={index} text={msg.text} sent={msg.sent}/>
        })
    }


    
    </div>
    {scrollBottom()}
    </> );
}

function Message({text,sent}) {
    return ( <p className={sent?"send":"recived"}>{text}</p> );
}

export default ChatBox;