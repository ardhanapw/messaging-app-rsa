import React, { useEffect, useState } from "react";
import { getKey, encrypt, decrypt } from "./utils/rsa";

const Chat = ({socket, username, groupChat}) => {
    const [currentMsg, setCurrentMsg] = useState("")
    const [msgList, setMsgList] = useState([])
    const [file, setFile] = useState()
    const [e, setE] = useState()
    const [d, setD] = useState()
    const [n, setN] = useState()
    const [receivedPubKey, setReceivedPubKey] = useState({groupChat: "", sentBy: "", e: 0, n: 0})

    const handleCurrentMsg = (event) => {
        setCurrentMsg(event.target.value)
    }

    const handleEnter = (event) => {
        if (event.key === "Enter"){
            sendMsg()
        }
    }

    const handleFile = (event) => {
        setFile(event.target.files[0])
    }

    const handleMsgList = (data) => {
        setMsgList((list) => [...list, data])
    }
    
    const handleKey = () => {
        setE(getKey().public)
        setD(getKey().private)
        setN(getKey().n)
        generateKeyFile()
    }


    const handleReceivedPubKey = (data) => {
        setReceivedPubKey(data)
    }

    const send = () => {
        sendMsg()
        //sendFile()
    }

    /*
    const sendFile = async() => {
        if(file !== undefined){
            const fileData = {
                groupChat: groupChat,
                sentBy: username,
                message: file,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
                type: "file"
            }
            await socket.emit("send-file", fileData)
        }
    }
    */

    const sendPublicKey = async() => {
        if (e !== 0 && n !== 0){
            const publicKey = {
                groupChat: groupChat,
                sentBy: username,
                e: e,
                n: n
            }
            await socket.emit("send-public-key", publicKey)
        }
    }

    const sendDecryptedMsgData = async() => {
        let lastMsg = msgList[msgList.length-1]

        const msgData = {
            groupChat: lastMsg.groupChat,
            sentBy: lastMsg.sentBy + " (Decrypted)",
            message: decrypt(lastMsg.message, d, n),
            time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            type: lastMsg.type
        }

        await socket.emit("send-msg", msgData)
        handleMsgList(msgData)
        setCurrentMsg("")
    }

    const sendMsg = async() => {
        if (currentMsg !== ""){
            const selfMsgData = {
                groupChat: groupChat,
                sentBy: username,
                message: currentMsg,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
                type: "text"
            }
            const sentMsgData = {
                groupChat: groupChat,
                sentBy: username,
                message: encrypt(currentMsg, receivedPubKey.e, receivedPubKey.n),
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
                type: "text"
            }
            await socket.emit("send-msg", sentMsgData)
            handleMsgList(selfMsgData)
            setCurrentMsg("")
        }
    }

    const generateKeyFile = () => {
        var FileSaver = require('file-saver');

        const pubKeyFilename = username + ".pub"
        const privKeyFilename = username + ".pri"
        const pubKeyContent = "(e, n): " +  e + ", " + n
        const privKeyContent = "(d, n): " +  d + ", " + n

        var pubBlob = new Blob([pubKeyContent], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(pubBlob, pubKeyFilename);

        var privBlob = new Blob([privKeyContent], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(privBlob, privKeyFilename);
    }

    const exportCiphertext = () => {
        var FileSaver = require('file-saver');

        const filename = "ciphertext.txt"
        const content = msgList[msgList.length-1]

        var fileBlob = new Blob([content.message], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(fileBlob, filename)

    }

    
    useEffect(() => {
        socket.on("receive-msg", (data) => {
            handleMsgList(data)
        })
    }, [socket])

    useEffect(() => {
        socket.on("receive-public-key", (data) => {
            handleReceivedPubKey(data)
        })
    }, [socket])

    /*
    useEffect(() => {
        socket.on("receive-file", (data) => {
            handleMsgList(data)
        })
    }, [socket])
    */
    
    return (
    <>
    <div class = "flex flex-col">
    <button class = "bg-gray-700 p-1 mb-2 text-white" onClick={handleKey}>Bangkitkan Kunci</button>
    <button class = "bg-gray-700 p-1 mb-2 text-white" onClick={sendPublicKey}>Kirim Kunci Publik</button>
    <button class = "bg-gray-700 p-1 mb-2 text-white" onClick={exportCiphertext}>Simpan Ciphertext Terakhir</button>
    <p>Kunci Privat anda: {d}, {n}</p>
    <p>Kunci Publik anda: {e}, {n}</p>
    <p>Kunci Publik dari penerima pesan: {receivedPubKey.e}, {receivedPubKey.n}</p>
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
                            {
                                (username === msgData.sentBy && "text" === msgData.type) && (<p>{msgData.message}</p>)
                            }
                            {
                                (username !== msgData.sentBy && "text" === msgData.type) && 
                                (
                                <div>
                                <p>{msgData.message}</p>
                                </div>)
                            }
                        </div>
                        <div class = "msg-metadata">
                            <p id = "time">{msgData.time}</p><br/>
                            {
                            (username !== msgData.sentBy && msgList[msgList.length-1] === msgData) &&
                            (
                            <div>
                            <button onClick={sendDecryptedMsgData}>decrypt</button>
                            </div>)
                            }
                        </div>

                    </div>
                </div>
                )
            })}

        </div>
        <div class="chat-footer">
            <input type = "text" value = {currentMsg} placeholder="Chat anda.." onChange={handleCurrentMsg} onKeyDown={handleEnter}></input>
            <label class = "content-center text-xl p-2">
                <input type = "file" onChange = {(e) => handleFile(e)} class = "hidden"></input>
                &#128206;
            </label>
            <button onClick={send}>&#9658;</button>
        </div>
    </div>
    </>
    )
}

export default Chat