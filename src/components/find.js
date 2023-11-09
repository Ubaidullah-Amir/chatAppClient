import { useNavigate } from "react-router-dom";
import { useUsers } from "../utils/reactQuery";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./Main";
import { Button } from "react-bootstrap";
import { useMutation } from "react-query";
import axios from "axios";
import defaultUserImage from "../assets/defaultUserImage.png"

function funcAddFriend(req_obj) {
    return axios.post(`${process.env.REACT_APP_API_URL}/friends/addfriend`,req_obj)
}

function FindPeople() {
    // navigate if not logged in 
    const {user}=useContext(UserContext)
    // arrRequestAlreadyMade contains the receiver's ids so rendering that person
    const [arrRequestAlreadyMade,setArrRequestAlreadyMade]=useState([])
    const Navigate = useNavigate()
    useEffect(()=>{
        if(!user){
            Navigate("/login")
        }
    },[])
    // add friend mutation
    const {mutate}=useMutation({mutationFn:funcAddFriend,
        onSuccess:(data)=>{
            
            console.log("Request successfully made",data.data)
            if(!data.data.req_obj.req_found){
                setArrRequestAlreadyMade((prevState)=>[...prevState,data.data.req_obj.req.reciever])
            }else{
                alert("Request is pending")
            }
        },
        onError:(error)=>{
            alert("Request is pending")
            console.log("Error in requesting friend",error)
        }
    })
    
    // get user logic
    const {isLoading,data,isError}=useUsers()
    if(isLoading){
        return <p>Loading</p>
    }
    if(isError){
        return <p>Unexpected Error occured</p>
    }
    if(!user){
        return <></>
    }
    const requestArray=data.user?.map((item)=>{
        const friendArr=user.friend.map((friend)=>(friend._id))
        if(item._id===user._id || friendArr.includes(item._id) || arrRequestAlreadyMade.includes(item._id)){
            return 
        }
        return <User user_id={user._id} mutate={mutate} key={item._id} people_id={item._id} people_name={item.name} people_image={item.image} people_email={item.email}/>

    })
    // removes the undefined in requestArray 
    const filteredReqArr=requestArray.filter((item)=>item)
    return ( 
        <>
        <h1>Find people</h1>
        {filteredReqArr.length>0?requestArray:<p>No user found.</p>}
        </>
     );
     
}
function User({people_name,people_id,mutate,user_id,people_image,people_email}) {
    const req_obj={
        currentUser_id:user_id,
        friend_id:people_id
    }
    return (
    <div>
            <div key={user_id} className="userCard" style={{fontSize:"13px",borderColor:"#cfcfcf"}}>
                <div className="child">
                        <div style={{width:"50px",height:"50px"}}>
                            {people_image?
                                <img style={{height:"100%",width:"100%",objectFit:"cover"}} className='rounded-circle' src={people_image} alt="profile image" />
                                :<img style={{height:"100%",width:"100%"}} className='rounded-circle' src={defaultUserImage} alt="profile image" />
                            }
                        </div>
                </div>
                    
                <div className="child" style={{gap:0}}>
                    <p >Username :<span style={{fontWeight:"bold"}}>{people_name}</span></p>
                    <p >Email :<span style={{fontWeight:"bold"}}>{people_email}</span></p>
                    <Button onClick={()=>{mutate(req_obj)}}>Add Friend</Button>
                </div>
            
            </div>
        
    </div>)
    
}

export default FindPeople;