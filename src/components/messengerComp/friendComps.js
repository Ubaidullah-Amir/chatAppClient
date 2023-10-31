import { useContext, useRef, useState } from "react";
import { UserContext } from "../Main";
import { useFetchFriends } from "../../utils/reactQuery";
import defaultUserImage from "../../assets/defaultUserImage.png"
import searchImg from "../../assets/search.png"
import Form from 'react-bootstrap/Form';

export function Frienditem({item}) {
    const {setSelectedFriend}=useContext(UserContext)
    return (
        <div className="chat_item" style={{display:"flex",gap:"5px",alignItems:"center",padding:"10px"}} onClick={()=>{
            setSelectedFriend(item)}}>
            
            <div style={{width:"40px",height:"40px"}}>
                {item.image?
                    <img style={{height:"100%",width:"100%",borderRadius:"50%",objectFit:"cover"}} src={item.image} alt="profile image" />
                    :<img style={{height:"100%",width:"100%",borderRadius:"50%",objectFit:"cover"}} src={defaultUserImage} alt="profile image" />
                }
            </div>
            <p style={{flexShrink:"0",margin:"0"}} >{item.name}</p>
        </div>
     );
}

export function FriendList({userID}) {
    const {data:friends,isLoading,isError } = useFetchFriends(userID)
    const [filterSearch,setFilterSearch] = useState("")
    
    if(isLoading){
        return <p>Loading friends ...</p>
    }
    if(isError){
        return <p>Error Occured.</p>
    }
    const filteredFriends=friends?.filter((friend)=>{
        return friend.name.toLowerCase().includes(filterSearch)
    })
    return ( 
    <div>
        <div style={{display:"flex",position:"relative",alignItems:"center"}}>
            
            <Form.Control onChange={(e)=>{setFilterSearch(e.target.value)}} value={filterSearch} style={{border:"0px ",borderBottom:"1px solid gray",borderRadius:"0.5rem",padding:"10px"}} placeholder="Search for chats"/>
            <div style={{position:"absolute",right:"0",width:"20px",aspectRatio:"1"}} ><img  style={{height:"100%",width:"100%"}} src={searchImg} alt="search "/></div>
        </div>
        {filteredFriends?.map((item)=>{
            return <Frienditem key={item._id}  item={item}/>
        })}
    </div>
     );
}
