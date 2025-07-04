import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./Authcontext";
import toast from "react-hot-toast";



export const ChatContext= createContext();


export const ChatProvider = ({children})=> {

    const [messages,setMessages] = useState([]);
    const [users,setUsers]= useState([]);
    const [selectedUser, setSelecteduser]=useState(null);
    const [unseenMessages, setUnseenMessages]= useState({});

    const {socket,axios}= useContext(AuthContext);
    //function to get all users for sidebar

    const getUsers= async () => {
        try {
            const {data} = await axios.get("/api/messages/users");
            if(data.success)
            {
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // function to get messages for selected user
    const getMessages = async(userId) => {
        try {
            const {data} = await axios.get(`/api/messages/${userId}`);
            if(data.success)
                setMessages(data.messages);
        } catch (error) {
            toast.error(error.message);
        }
    }

    // function to send message to select user
    const sendMessage = async (messageData) => {
        try {
            const {data}= await axios.post(`/api/messages/send/${selectedUser._id}`
                ,messageData
            );
            if(data.success){
                setMessages((prevMessages)=> [...prevMessages,data.newMessage])

            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }


    // function to subscribe to messages for selected user
    const subscribeToMessages =async()=> {
        if(!socket) return;

        socket.on("newMessage", (newMessage)=> {
            if(selectedUser && newMessage.senderId=== selectedUser._id)
            {
                newMessage.seen=true;
                setMessages.seen=true;
                setMessages((prevMessages)=> [...prevMessages,newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);

            }
            else
            {
                setUnseenMessages((prenUnseenMessages)=> ({
                    ...prenUnseenMessages,[newMessage.senderId] : prenUnseenMessages[newMessage.senderId]
                    ? prenUnseenMessages[newMessage.senderId] +1 : 1
                }))
            }
        })
    }


    // function to unsubscribe from messages
    const unsubscribefromMessages = () => {
        if(socket) socket.off("newMessage");
    }
    useEffect(()=> {
        subscribeToMessages();
        return ()=> unsubscribefromMessages();

    },[socket,selectedUser])
    const value={
        messages,
        users,
        selectedUser,
        getUsers,setMessages,sendMessage,setSelecteduser,
        unseenMessages,setUnseenMessages

    }
    return <ChatContext.Provider value={value}>

        {children}
    </ChatContext.Provider>
}