import { useNavigate } from "react-router-dom";
import { useRequests, useUsers } from "../utils/reactQuery";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./Main";
import { Button } from "react-bootstrap";
import { useMutation } from "react-query";
import axios from "axios";
const baseURL="http://localhost:3030"
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
        return <Request user_id={user._id} mutate={mutate} key={item._id} friend_id={item.sender._id} name={item.sender.name}/>
        // Sender => friend
        // reciever => user 
        })

    return ( 
        <>
        <h1>Requests from people</h1>
        {mainRequestArr.length>0?mainRequestArr:<p>No Request found</p>}
        </>
     );
     
}
function Request({name,friend_id,mutate,user_id}) {
    const req_obj={
        currentUser_id:user_id,
        friend_id:friend_id
    }
    return (
    <div>
        <p>Name :{name}</p>
        <Button onClick={()=>{mutate(req_obj)}}>Accept</Button>
    </div>)
    
}

export default Requests;