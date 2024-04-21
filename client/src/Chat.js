import React, { useEffect, useState } from "react";

const Chat = ({socket, username, groupChat}) => {
    const [currentMsg, setCurrentMsg] = useState("")

    const handleCurrentMsg = (event) => {
        setCurrentMsg(event.target.value)
    }

    const sendMsg = async() => {
        if (currentMsg !== ""){
            const msgData = {
                groupChat: groupChat,
                sentBy: username,
                message: currentMsg,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            }
            await socket.emit("send-msg", msgData)
        }
    }

    useEffect(() => {
        socket.on("receive-msg", (data) => {
            console.log(data, "di use effect")
        })
    }, [socket])

    return (
    <>
    <div>
        <div>
            <p>Kolom Chat</p>
        </div>
        <div>
            <p>Body Chat</p>
        </div>
        <div>
            <input type = "text" placeholder="Chat anda.." onChange={handleCurrentMsg}></input>
            <button onClick={sendMsg}>Send</button>
        </div>

    </div>
    </>
    )
}

export default Chat