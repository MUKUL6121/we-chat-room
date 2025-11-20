import { useState, useRef, useEffect } from 'react';
import './chat.css';
import { io } from 'socket.io-client';

function Chat() {
    const [users, setUsers] = useState("0");
    const [msg, setMsg] = useState("");
    const [name, setName] = useState("");
    const [status, setStatus] = useState("Connect");
    const [color, setColor] = useState("red");
    const [allchat, setAllChat] = useState([]);

    const inputref = useRef();
    const msgEndRef = useRef();
    const socketRef = useRef(null);

    const getTime = () => {
        const t = new Date();
        const hrs = t.getHours();
        const min = t.getMinutes();
        return `${hrs} : ${min}`;
    };

    const connect = () => {
        if (status === "Connect") {
            socketRef.current = io("http://localhost:2000");

            socketRef.current.on("connect", () => {
                console.log("Connected to server");
                setColor("green");
                setStatus("Disconnect");

                socketRef.current.on("users", (count) => {
                    setUsers(count);
                });

                socketRef.current.on("old_chat", (chats) => {
                    setAllChat(chats);
                });

            });
        } else {
            socketRef.current.emit("Leave", { name });
            socketRef.current.disconnect();
            socketRef.current = null;
            setAllChat([]);
            setColor("red");
            setStatus("Connect");
            setUsers("0");
            console.log("Disconnected");
        }
    };

    var Sendmessage = (event) => {
        event.preventDefault();
        const time = getTime();
        const data = { name, msg, time };

        socketRef.current.emit("send_message", data);
        setMsg("");
        inputref.current.value = "";
    };

    useEffect(() => {
        msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [allchat]);


    useEffect(() => {
        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, []);
    return (
        <div>
            <h1>Prime- Chat</h1>
            <div id="main" className="p-3">
                <div className="d-flex">
                    <h2>Inbox</h2><p> {users}</p>
                    <div id="circle" className="mt-3" style={{ background: `${color}` }}></div>
                </div>

                <button onClick={connect} id="connect">{status}</button>

                <div id="user">
                    <input
                        type="text"
                        id="user-name"
                        placeholder="enter your name"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div id="msgs" className="chat-box">
                    {allchat.map((d, index) => (
                        <p key={index}>
                            <strong>{d.name}</strong>: {d.msg} <small>({d.time})</small>
                        </p>
                    ))}
                    <div ref={msgEndRef} />
                </div>

                <div id="send">
                    <form onSubmit={Sendmessage}>
                        <input
                            ref={inputref}
                            type="text"
                            id="msg-input"
                            placeholder="enter message"
                            required
                            onChange={(e) => { setMsg(e.target.value); }}
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            </div>
        </div >
    );
}

export default Chat;
