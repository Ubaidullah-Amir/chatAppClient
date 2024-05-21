import { Button } from "react-bootstrap";
import { useConversation } from "../../utils/reactQuery";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { UserContext } from "../Main";
import styles from "./message.module.css"
import { CloseCircleOutlined, DeleteOutlined, FileImageOutlined, FilePdfOutlined, SendOutlined, UploadOutlined, VideoCameraOutlined } from "@ant-design/icons";


const baseURL=process.env.REACT_APP_API_URL
// never using the below function (redundent saving the msg using socket)
// function funcPostMsg(req_obj) {
//     return axios.post(`${baseURL}/chat/add_msg`,req_obj)
// }
function deleteConversation(id) {
    console.log("id",id)
    return axios.post(`${baseURL}/chat/deleteConversation`,{id})
}
async function uploadFile(file) {
 
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${baseURL}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  };


function ChatBox({user,selectedFriend}) {
    const defaultMessageObj = {
        type:"text",
        data:"",
        inputValue:""
    }
    const queryClient=useQueryClient()
    const {socket}=useContext(UserContext)
    const [ownMessages, setOwnMessages] = useState([])
    const [RecievedMessages, setRecievedMessages] = useState([])
    const [DisplayMessageArr, setDisplayMessageArr] = useState([])
    const [messageObj,setMessageObj] = useState(defaultMessageObj)
    const [mediaClick, setMediaClick] = useState(null);
    // since inside of socket events the selectedFriend is not updating hence using useRef and useContext not working in events
    const refSelectedFriend = useRef(0)
    refSelectedFriend.current = selectedFriend
   // msg input state
    // const [inputValue]=useState("")
    // user currently typing 
    const [isTyping,setIsTyping]=useState(false)
    const fileInputRef = useRef(null);
    
    

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
    function handleMediaIconClick(type) {
        setMessageObj((prevState)=>({...prevState,type:type,data:""}))
        setMediaClick(type);
    }
    useEffect(() => {
        if (mediaClick) {
          fileInputRef.current.click();
          setMediaClick(null);
        }
      }, [mediaClick]);
    
    function onChangeInputMessage(e) {
        setMessageObj((prevState)=>({...prevState,inputValue:e.target.value}))
            
        socket.emit("user-typing",{userID:user._id ,selectedFriendID:selectedFriend._id})
            
    }
    const handleFileChange = (event) => {
        if (!event.target.files.length) {
            setMessageObj((prevState) => ({...prevState, type: "text", data: ""}));
        } else {
            // Handle file selection
            setMessageObj((prevState)=>({...prevState,data:event.target.files[0]}))
        }
        
      };
    function returnFileAccept() {

       if(messageObj.type === "pdf"){
            return "application/pdf"
        }else if(messageObj.type === "image"){
            return "image/png, image/jpeg, image/gif"
        }else if(messageObj.type === "video"){
            return "video/mp4, video/webm, video/ogg"
        }
        
    }
    const {isLoading,data,isError,isFetching}=useConversation(user._id,selectedFriend._id,onSuccessUseConversation)
    useEffect(() => {
        const eventListener = (msg)=>{
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
    const { mutate:uploadFileMutation } = useMutation(uploadFile, {
        onSuccess: (imageObj) => {
            // Handle success
            console.log('File uploaded successfully:', imageObj);
            const req_body={
                chat_id:data.chat._id,
                msg_obj:{
                    to:selectedFriend._id,
                    from:user._id,
                    description:messageObj.inputValue,
                    type:messageObj.type,
                    data:imageObj.url
                }
            }
            // to server
            // mutate(req_body)
            // websocket 
            socket.emit("send-message",req_body)
            
            // Perform additional actions here
        },
        onError: (error) => {
            // Handle error
            console.error('Error uploading file:', error);
        }
        });


    function onSubmit(e) {
        e.preventDefault()
        
        if(!isLoading & !isError){
            if (messageObj.type != "text" && messageObj.data) {
                uploadFileMutation(messageObj.data);
            }else{
                const req_body={
                    chat_id:data.chat._id,
                    msg_obj:{
                        to:selectedFriend._id,
                        from:user._id,
                        description:messageObj.inputValue,
                        type:"text",
                        data:""
                    }
                }
                // to server
                // mutate(req_body)
                // websocket 
                socket.emit("send-message",req_body)
            }
        }
        const msg_obj={
            description:messageObj.inputValue,
            type:messageObj.type,
            data:messageObj.data,
            sent:true,
            myMsg:true
        }
        setOwnMessages((pervState)=>([...pervState,msg_obj]))
        // second Approch
        setDisplayMessageArr((prevState)=>([...prevState,msg_obj]))
        // clear input bar
        setMessageObj((prevState)=>(defaultMessageObj))
      
    
}

    if(isLoading){
        return <p>Loading Chat ...</p>
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
            <div className={styles.topContainer}>
                <p className={styles.userNameHeading}>{selectedFriend.name}{isTyping ?<span> (typing)</span>:<></>}</p>
                <DeleteOutlined className={styles.icon}  onClick={()=>{
                    const confirmText= "Do you want to delete Chat.\n NOTE: For transparency reasons deleting chat deletes it from both sides.Do you wish to continue?"
                    const confirm = window.confirm(confirmText);
                    // 
                    if(confirm){
                        deleteChat(data.chat._id)
                    }
                }}/>
            
            </div>
            <div >
                {/* RecievedMessages &&  ownMessages are not used are combined with DisplayMessageArr */}
                    <MessageContainer 
                    DisplayMessageArr={DisplayMessageArr}
                    messages={data.chat.conversation}
                    // RecievedMessages={RecievedMessages} 
                    // ownMessages={ownMessages} 
                    />

                    
             

                    <FormMessageInput 
                    onSubmit={onSubmit}
                    handleMediaIconClick={handleMediaIconClick}
                    onChangeInputMessage={onChangeInputMessage}
                    handleFileChange={handleFileChange}
                    FileInputAccept = {returnFileAccept()}
                    fileInputRef = {fileInputRef}
                    messageObj={messageObj}
                    handleMediaCancel= {()=>setMessageObj((preState)=>({...preState,type:"text",data:""}))}

                    
                    />
            </div>
        </div>
     );
}


function MessageContainer({messages,DisplayMessageArr}) {
    // console.log("DisplayMessageArr",DisplayMessageArr)
    const {user}=useContext(UserContext)
    useEffect(() => {
        scrollBottom();
    }, [messages.length,DisplayMessageArr.length]);
    function scrollBottom(){
        if(!scrollDiv.current){
            return
        }
        scrollDiv.current.scrollTop = 2*scrollDiv.current.scrollHeight
    }
    const scrollDiv=useRef()
    return ( <><div ref={scrollDiv} className={styles.message_container}>
    
    {messages.map((msg)=>{
        if(msg.from===user._id){
            // user send message
            return <Message key={msg._id} data={msg.data} type={msg.type} text={msg.description} sent={true}/>
        }
        return <Message key={msg._id}  data={msg.data} type={msg.type} text={msg.description} sent={false}/>
    })
    }
    {
        DisplayMessageArr.map((msg,index)=>{
            return <Message key={index} myMsg={msg.myMsg} data={msg.data}  type={msg.type} text={msg.description} sent={msg.sent}/>
        })
    }
    {scrollBottom()}
    
    </div>
    </> );
}

function Message({text,sent,type,data,myMsg}) {
    if (type === "text"){
        return ( <p className={sent?styles.send:styles.recived}>{text}</p> );
    }
    else if(type === "image"){
        return (
            <div className={sent?styles.send:styles.recived}>
                {
                    myMsg?
                    
                    <img className={styles.displayImage} src={URL.createObjectURL(data)} alt="image" />
                    :
                    <img className={styles.displayImage} src={data} alt="image"/>
                }<p>{text}</p>
            </div>
        )
    }
    else if(type === "video"){
        return (
            <div className={sent?styles.send:styles.recived}>
                
                {
                    myMsg?
                    <video className={styles.displayImage} src={URL.createObjectURL(data)} alt="video"/>
                    :
                    <video className={styles.displayImage} src={data} alt="video"/>
                }
                
                <p>{text}</p>
            </div>
        )
    }
    else if(type === "pdf"){
        return (
            <div className={sent?styles.send:styles.recived}>
                <iframe
                className={styles.displayImage}
                src={myMsg?URL.createObjectURL(data):data}
                title="PDF Document"
                />
                <p>{text}</p>
            </div>
        )
    }
    
}

function FormMessageInput({
    onSubmit,
    handleMediaIconClick,
    
    onChangeInputMessage,
    FileInputAccept,
    fileInputRef,
    handleFileChange,
    messageObj,
    handleMediaCancel
    
}) {
    return (
    <form onSubmit={onSubmit} className={styles.input_container}>
    { messageObj.type != "text" ?  
    <> 
        <div className={styles.absUploadMenu}>
        <CloseCircleOutlined onClick={handleMediaCancel} className={`${styles.icon} ${styles.cancelMediaIcon}`} />
        {messageObj.type === "image" && messageObj.data &&
            <img className={styles.imageViewer} src={URL.createObjectURL(messageObj.data)} alt="selected image" />
        }
        {messageObj.type === "video" && messageObj.data &&
            <video className={styles.videoViewer} controls>
                <source src={URL.createObjectURL(messageObj.data)} type={messageObj.data.type} />
                Your browser does not support the video tag.
            </video>
        }
        {messageObj.type === "pdf" && messageObj.data &&
            <iframe
                src={URL.createObjectURL(messageObj.data)}
                title="PDF Document"
                className={styles.PdfViewer}
            />
        }
            
        </div>
    </>
    :null}
        <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleFileChange} 
            accept={FileInputAccept} // Specify acceptable file types
        />
        <FileImageOutlined onClick={()=>handleMediaIconClick("image")} className={styles.icon}/> 
        <VideoCameraOutlined onClick={()=>handleMediaIconClick("video")} className={styles.icon}/>
        <FilePdfOutlined onClick={()=>handleMediaIconClick("pdf")} className={styles.icon}/>
        <input value={messageObj.inputValue} onChange={onChangeInputMessage} placeholder="message"/>
        <Button type="submit"><SendOutlined className={styles.icon} /></Button>
    </form>
    )
    
}

export default ChatBox;