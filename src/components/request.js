import { useNavigate } from "react-router-dom";
import { useRequests, useUsers } from "../utils/reactQuery";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./Main";
import { Button } from "react-bootstrap";
import { useMutation } from "react-query";
import axios from "axios";
import defaultUserImage from "../assets/defaultUserImage.png"
import styles from "./find.module.css"

const baseURL=process.env.REACT_APP_API_URL
function funcRequestAcceptor(req_obj) {
    return axios.post(`${baseURL}/request/requestapproved`,req_obj)
}

function Requests() {
    // navigate if not logged in 
    const {user,setUser}=useContext(UserContext)
    const [arrRequestAccepted,setArrRequestAccepted]=useState([])
    const Navigate = useNavigate()
    useEffect(()=>{
        if(!user){
            Navigate("/login")
        }
    },[])
    // add friend mutation
    const {mutate}=useMutation({mutationFn:funcRequestAcceptor,
        onSuccess: (data) => {
            console.log("Friend added successfully", data.data);
            //update the user with new friend
            setUser(data.data.user);
            //add id of the person that is succefully added so not to rerender them
            setArrRequestAccepted((prevState)=>[...prevState,data.data.person_id])
        },
        onError:(error)=>{
            console.log("Error in adding friend",error)
        }
    })
    // get user logic
    const {isLoading,data,isError}=useRequests(user?._id)
    if(isLoading){
        return <p>Loading</p>
    }
    if(isError){
        return <p>Unexpected Error occured</p>
    }
    if(!user){
        return <></>
    }
    const mainRequestArr=data.request.map((item)=>{
        if(arrRequestAccepted.includes(item.sender._id)){
            return 
        }
        return <Request user_id={user._id} mutate={mutate} key={item._id} friend_id={item.sender._id} friend_name={item.sender.name} friend_email={item.sender.email} friend_image={item.sender.image}/>
        // Sender => friend
        // reciever => user 
        })

    return ( 
        <div style={{padding:"1em"}}>
        <h1>Requests from people</h1>
        <div className={styles.friendContainer}>
        {mainRequestArr.length>0?mainRequestArr:<p>No Request found</p>}
        </div>
        </div>
     );
     
}
function Request({mutate,user_id,friend_id,friend_name,friend_email,friend_image}) {
    const req_obj={
        currentUser_id:user_id,
        friend_id:friend_id
    }
    return (
        <div key={friend_id} className={styles.profileContainer}>
                <div className={styles.profileCard}>
                    {friend_image?
                        <img   src={friend_image} alt="profile image" />
                        :<img   src={defaultUserImage} alt="profile image" />
                    }
                                
                    <p className={styles.NameText}>{friend_name}</p>
                    <p className={styles.EmailText}>{friend_email}</p>
                    <Button onClick={()=>{mutate(req_obj)}}>Accept Request</Button>
                </div>
            </div>
   )
    
}

export default Requests;