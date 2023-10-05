
import { useQuery} from "react-query"
import axios from  "axios"

const baseURL="http://localhost:3030"
// Login : posting user obj 
export function postUserQuery(onSuccess,onError) {
    return null
}



async function fetchFriends(user_id) {
    const request= await axios.post(`${baseURL}/friends`,{
        id:user_id
    })
    return request.data.friends.friend
}

// getting conversation
export function useFetchFriends(user_id) {
    return useQuery(["friends",user_id],()=>(fetchFriends(user_id)))
}
// getting conversation
export function useConversation(user_id,friend_id,onSuccess) {
    return useQuery(`conversation-${friend_id}`,()=>(fetchConversation(user_id,friend_id)),
    {
        
        onSuccess:onSuccess
    })
}
async function fetchConversation(user_id,friend_id) {
    const request= await axios.post(`${baseURL}/chat`,{
        user_id:user_id,
        friend_id:friend_id
    })
    return request.data
}

// getting users
export function useUsers() {
    return useQuery("users",()=>(fetchUsers()))
}
async function fetchUsers() {
    const request= await axios.get(`${baseURL}/user/getusers`)
    return request.data
}
// getting request
export function useRequests(id) {
    return useQuery("requests",()=>(fetchRequest(id)))
}
async function fetchRequest(user_id) {
    console.log("fetching request",user_id)
    const request= await axios.post(`${baseURL}/request/getrequests`,{
        id:user_id
    })
    return request.data
}