import { useNavigate } from "react-router-dom";
import { useUsers } from "../utils/reactQuery";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./Main";
import { Button } from "react-bootstrap";
import { useMutation } from "react-query";
import axios from "axios";
import defaultUserImage from "../assets/defaultUserImage.png"
import styles from "./find.module.css"

function funcAddFriend(req_obj) {
    return axios.post(`${process.env.REACT_APP_API_URL}/friends/addfriend`,req_obj)
}

function FindPeople() {
    // navigate if not logged in 
    const {user}=useContext(UserContext)
    const [filter,setFilter] = useState("")
    const [debouncedValue, setDebouncedValue] = useState(filter);
    const delay = 1000
    useEffect(() => {
        const handler = setTimeout(() => {
        setDebouncedValue(filter);
        }, delay);

        return () => {
        clearTimeout(handler);
        };
    }, [filter]);
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
    const {isLoading,data,isError}=useUsers({search:debouncedValue})
    
    if(!user){
        return <></>
    }
    let requestArray= data && data?.user?.map((item)=>{
        const friendArr=user.friend.map((friend)=>(friend._id))
        if(item._id===user._id || friendArr.includes(item._id) || arrRequestAlreadyMade.includes(item._id)){
            return 
        }
        return <User user_id={user._id} mutate={mutate} key={item._id} people_id={item._id} people_name={item.name} people_image={item.image} people_email={item.email}/>

    })
    if (!requestArray){
        requestArray = []
    }
    // removes the undefined in requestArray 
    const filteredReqArr=requestArray.filter((item)=>item)
    
    return ( 
        <div style={{padding:"1em"}}>
        {isLoading?<p>Searching , Please wait ...</p>:null}
        {isError?<p>Error occured</p>:null}
        
        <h1>Find people</h1>
        <input value={filter} className={styles.mainSearch} onChange={(e)=>setFilter(e.target.value)} placeholder="Search for people "/>
        <div className={styles.friendContainer}>
            {filteredReqArr.length>0?requestArray:<p>No user found.</p>}
        </div>
        </div>
     );
     
}
function User({people_name,people_id,mutate,user_id,people_image,people_email}) {
    const req_obj={
        currentUser_id:user_id,
        friend_id:people_id
    }
    return (
        <div key={people_id} className={styles.profileContainer}>
                <div className={styles.profileCard}>
                    {people_image?
                        <img   src={people_image} alt="profile image" />
                        :<img   src={defaultUserImage} alt="profile image" />
                    }
                                
                    <p className={styles.NameText}>{people_name}</p>
                    <p className={styles.EmailText}>{people_email}</p>
                    <Button onClick={()=>{mutate(req_obj)}}>Add Friend</Button>
                </div>
            </div>
    )
    
}

export default FindPeople;