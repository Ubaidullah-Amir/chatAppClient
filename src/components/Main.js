import { Route, Routes } from "react-router-dom";
import Messenger from "./messenger";
import NavBar from "./navbar"
import NotFound from "./notfound";
import Login from "./login";
import SignUp from "./signup";
import Request from "./request";
import { createContext, useEffect, useState } from "react";
import io from "socket.io-client"
import FindPeople from "./find";
import Profile from "./profile";
const socket = io.connect("http://localhost:3030")
export const UserContext = createContext()


// const initialState={
//     user:"",
//     selectedFriend:""
// }
// function reducer(state,action) {
//     switch (action.type) {
//         case "UserLoggedIn":
//             return {...state,user:action.payload.user}
//             break;
    
//         default:
//             break;
//     }
// }

export function MainComp() {
    const [user,setUser]=useState()
    const [selectedFriend,setSelectedFriend]=useState()
    if(user!=null){
        socket.emit("userOnline",user._id)
    }
    return ( <>
        <NavBar disable={!user}/>
        <UserContext.Provider value={{user:user,setUser:setUser,selectedFriend:selectedFriend,setSelectedFriend:setSelectedFriend,socket}}>
        <Routes>
            <Route path="/" element={<Messenger/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/find" element={<FindPeople/>}/>
            <Route path="/request" element={<Request/>}/>
            <Route path="/porfile" element={<Profile/>}/>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
        </UserContext.Provider>


        </>
     );
}