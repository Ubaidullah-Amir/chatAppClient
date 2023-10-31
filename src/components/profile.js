
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
                <div className={Styles.child}>
                        <div style={{width:"100px",height:"100px"}}>
                            {user.image?
                                <img style={{height:"100%",width:"100%",objectFit:"cover"}} className='rounded-circle' src={user.image} alt="profile image" />
                                :<img style={{height:"100%",width:"100%"}} className='rounded-circle' src={defaultUserImage} alt="profile image" />
                            }
                        </div>
                </div>
                        
                    <div className={Styles.child}>
                        <p >Username :<span style={{fontWeight:"bold"}}>{user.name}</span></p>
                        <p >Email :<span style={{fontWeight:"bold"}}>{user.email}</span></p>
                        <ModalProfileEdit user={user} setUser={setUser} />
                    </div>
                
            </div>
           
            <h2 style={{}}>Friends</h2>
            {user.friend?.map(friend=>{
                return (
                    <div key={friend._id} className={Styles.profileContainer} style={{fontSize:"13px",borderColor:"#cfcfcf"}}>
                    <div className={Styles.child}>
                            <div style={{width:"50px",height:"50px"}}>
                                {friend.image?
                                    <img style={{height:"100%",width:"100%",objectFit:"cover"}} className='rounded-circle' src={friend.image} alt="profile image" />
                                    :<img style={{height:"100%",width:"100%"}} className='rounded-circle' src={defaultUserImage} alt="profile image" />
                                }
                            </div>
                    </div>
                            
                        <div className={Styles.child} style={{gap:0}}>
                            <p >Username :<span style={{fontWeight:"bold"}}>{friend.name}</span></p>
                            <p >Email :<span style={{fontWeight:"bold"}}>{friend.email}</span></p>
                        </div>
                    
                    </div>
                )
            })}
        </div>
    );
}
