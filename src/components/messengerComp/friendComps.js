import { useContext, useState } from "react";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import ListGroup from "react-bootstrap/esm/ListGroupItem";
import { UserContext } from "../Main";
import { useFetchFriends } from "../../utils/reactQuery";
import defaultUserImage from "../../assets/defaultUserImage.png"
import searchImg from "../../assets/search.png"
import Form from 'react-bootstrap/Form';

export function Frienditem({item}) {
    const {setSelectedFriend}=useContext(UserContext)
    return (
        <div className="chat_item" style={{paddingTop:"32px",paddingBottom:"32px",display:"flex",justifyContent:"space-around",alignItems:"center",maxHeight:"50px"}} onClick={()=>{
            setSelectedFriend(item)}}>
            
            <div style={{width:"50px",aspectRatio:"1",flexShrink:"1"}}>
                {item.image?
                    <img style={{height:"100%",width:"100%"}} src={item.image} alt="profile image" />
                    :<img style={{height:"100%",width:"100%"}} src={defaultUserImage} alt="profile image" />
                }
            </div>
            <p style={{flexShrink:"0",margin:"0"}} >{item.name}</p>
        </div>
     );
}

export function FriendList({userID}) {
    const {data:friends,isLoading,isError } = useFetchFriends(userID)
    if(isLoading){
        return <p>Loading friends ...</p>
    }
    if(isError){
        return <p>Error Occured.</p>
    }
    return ( 
    <div>
        <SearchFriend friends={friends}/>
        {friends?.map((item)=>{
            return <Frienditem key={item._id}  item={item}/>
        })}
    </div>
     );
}

function SearchFriend({friends}) {
    const [showSearchBar,setShowSearchBar] = useState(false)
    return(
        <div style={{display:"flex",position:"relative",alignItems:"center"}}>
            
            <Form.Control style={{borderTop:"0",borderLeft:"0",borderRight:"0"}} placeholder="Search for chats"/>
            <div style={{position:"absolute",right:"0",width:"20px",aspectRatio:"1"}} onClick={()=>{setShowSearchBar((prevState)=>!prevState)}}><img  style={{height:"100%",width:"100%"}} src={searchImg} alt="search "/></div>
        </div>
    )
}
// {transition:"all 1000ms",position:"absolute",cursor:"pointer",top:"0"}