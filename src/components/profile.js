
import React, { useContext, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { UserContext } from './Main'
import defaultUserImage from "../assets/defaultUserImage.png"
import ModalProfileEdit from './modalProfileEdit';
import Styles from "../profile.module.css";



export default function Profile() {
    const {user,setUser}=useContext(UserContext)
    const Navigate = useNavigate()
    useEffect(()=>{
        if (!user){
            Navigate("/login")
            return
        }
    },[])
    if (!user){
        Navigate("/login")
        return
    }
    return (
        <div style={{padding:"1px"}}>
            
            <div className={Styles.profileContainer}>
                <div className={Styles.profileCard}>
                    {user.image?
                        <img   src={user.image} alt="profile image" />
                        :<img   src={defaultUserImage} alt="profile image" />
                    }
                                
                    <p className={Styles.NameText}>{user.name}</p>
                    <p className={Styles.EmailText}>{user.email}</p>
                    <ModalProfileEdit user={user} setUser={setUser} />
                </div>
            </div>
           
            <h2 style={{}}>Friends</h2>
            <div className={Styles.friendContainer}>
            {user.friend?.map(friend=>{
                return (
                    <div key={friend._id} className={Styles.profileContainer}>
                <div className={Styles.profileCard}>
                    {friend.image?
                        <img   src={friend.image} alt="profile image" />
                        :<img   src={defaultUserImage} alt="profile image" />
                    }
                                
                    <p className={Styles.NameText}>{friend.name}</p>
                    <p className={Styles.EmailText}>{friend.email}</p>
                </div>
            </div>
                    
                )
            })}
            </div>
        </div>
    );
}
