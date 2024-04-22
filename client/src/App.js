import './App.css';
import io from 'socket.io-client'
import { useState } from 'react';
import Chat from './Chat';

const socket = io.connect("http://localhost:5000")

function App() {
  const [username, setUsername] = useState("")
  const [groupChat, setGroupChat] = useState("")
  const [isJoined, setIsJoined] = useState(false)


  const handleUsername = (event) => {
    setUsername(event.target.value)
  }

  const handleGroupChat = (event) => {
    setGroupChat(event.target.value)
  }

  const joinGroupChat = () => {
    if (username !== "" && groupChat !== ""){
      const credentials = {username: username, groupChat: groupChat}
      socket.emit("join-group-chat", credentials)
      setIsJoined(true)
    }
  }

  return (
    <div class="App">
      {isJoined === false?
        <div class="joinChatContainer bg-red-600">
          <p class="text-xl font-bold">Masuk</p>
          <input type = "text" placeholder = "Masukkan username.." onChange={handleUsername}></input>
          <input type = "text" placeholder = "Masukkan nama group chat.." onChange={handleGroupChat}></input>
          <button onClick = {joinGroupChat}>Masuk ke group chat</button>
        </div>
        :
        <Chat socket = {socket} username = {username} groupChat = {groupChat}/>
      }

      
    </div>
  );
}

export default App;
