import React, { useEffect, useState, useRef} from "react";

const Chat = ({socket, username, groupChat}) => {
    const [currentMsg, setCurrentMsg] = useState("")
    const [msgList, setMsgList] = useState([])

    const handleCurrentMsg = (event) => {
        setCurrentMsg(event.target.value)
    }

    const handleEnter = (event) => {
        if (event.key === "Enter"){
            sendMsg()
        }
    }

    const handleMsgList = (data) => {
        setMsgList((list) => [...list, data])
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
            handleMsgList(msgData)
            setCurrentMsg("")
        }
    }

    
    useEffect(() => {
        socket.on("receive-msg", (data) => {
            handleMsgList(data)
        })
    }, [socket])
    

    return (
    <>
    <div class = "flex flex-col">
    <button class = "bg-gray-700 p-1 mb-2 text-white">Bangkitkan Kunci</button>
    <button class = "bg-gray-700 p-1 mb-2 text-white">Kirim Kunci Publik</button>
    <p>Kunci Privat anda: </p>
    <p>Kunci Publik anda: </p>
    <p>Kunci Publik dari penerima pesan: </p>
    </div>
    <div class = "chat-window">
        <div class="chat-header">
            <p>{groupChat}</p>
        </div>
        <div class="chat-body overflow-y-scroll focus:scroll-auto">
            {msgList.map((msgData) => {
                return (
                <div class = "msg" id = {username === msgData.sentBy? "you" : "other"}>
                    <div>
                        <div class = "msg-metadata">
                            <p id = "author">{msgData.sentBy}</p>
                        </div>
                        <div class = "msg-content">
                            <p>{msgData.message}</p>
                        </div>
                        <div class = "msg-metadata">
                            <p id = "time">{msgData.time}</p>
                        </div>
                    </div>
                </div>
                )
            })}

        </div>
        <div class="chat-footer">
            <input type = "text" value = {currentMsg} placeholder="Chat anda.." onChange={handleCurrentMsg} onKeyDown={handleEnter}></input>
            <button onClick={sendMsg}>Send</button>
        </div>
    </div>
    </>
    )
}

export default Chat