import { useRef, useEffect, useState } from "react";
import "./Room.css";
import { io } from 'socket.io-client';

function Room() {
    const [check, setCheck] = useState(false);
    const checkbox = useRef(null);
    const socketRef = useRef(null);
    const [roomId, setRoomId] = useState("");
    const [password, setPassword] = useState("");
    const [joinId, setJoinId] = useState("");
    const [joinpassword, setJoinPassword] = useState("");
    // const [Room, setRoom] = useState(null);

    function CreateROOM(event) {
        event.preventDefault();
        const data = { roomId, password };
        socketRef.current.emit('create-room', data);
        event.target.reset();
        console.log("room Created");
    };
    function JoinROOM(event) {
        event.preventDefault();
        const joindata = { joinId, joinpassword };
        setRoomId(joinId);
        socketRef.current.emit('join-room', joindata);
        console.log("JOINING");
    };

    useEffect(() => {
        if (check === true) {
            socketRef.current = io("http://localhost:3000");

            socketRef.current.on("connect", () => {
                console.log("connected to server");
                checkbox.current.style.backgroundColor = "green";
                socketRef.current.on('rooms', (rooms) => {
                    console.log("Available rooms:", rooms);
                });
            });

        } else {
            if (socketRef.current) {
                socketRef.current.disconnect();
                console.log("disconnected from server");
                // document.querySelector('#switchCheck').style.backgroundColor = "red";
                checkbox.current.style.backgroundColor = "grey";
                // checkbox.current.style.color = "white";
            }
        };

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [check]);


    return (
        <div id="main" className="mt-5">
            <div className="d-flex direction-column text-center">
                <h2 className="mb-3"> Room Section </h2>
                {/* check-Box */}
                <div className="form-check form-switch mt-2 ms-4">
                    <input className="form-check-input" ref={checkbox} type="checkbox" role="switch" id="switchCheck" onChange={(e) => {
                        setCheck(e.target.checked);
                        console.log(e.target.checked);
                    }} />
                    <label className="form-check-label " htmlFor="switchCheck">{check ? "Online" : "Offline"}</label>
                </div>
            </div>
            {/* Buttons */}
            <div id="buttons" className="w-75 d-flex flex-column ms-4">
                <button data-bs-target="#CrEate" data-bs-toggle="modal">Create Room</button>
                <button data-bs-target="#JoIn" data-bs-toggle="modal">Join</button>
            </div>


            {/* //Modal for Create Room */}
            <section>
                <div className="modal fade w-100" id="CrEate" aria-hidden="true">
                    <div className="modal-dialog mt-5 w-100">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h3>Create Room</h3>
                                <button
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                ></button>
                            </div>

                            <div className="modal-body text-center">
                                <form action="" onSubmit={CreateROOM}>
                                    <label htmlFor="" className="w-25 mt-2">Room Id :</label>
                                    <input type="text" className="bg-white text-primary" onChange={(e) => setRoomId(e.target.value)} /><br />
                                    <label htmlFor="" className="w-25 mt-2">Password :</label>
                                    <input type="text" className="bg-white text-primary" onChange={(e) => setPassword(e.target.value)} /><br />
                                    <button className="w-50 mt-3 ms-5" >Create</button>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* //Modal for Join Room */}
            <section>
                <div className="modal fade w-100" id="JoIn" aria-hidden="true">
                    <div className="modal-dialog mt-5 w-100">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h3>Join Room</h3>
                                <button
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                ></button>
                            </div>

                            <div className="modal-body text-center">
                                <form action="" onSubmit={JoinROOM}>
                                    <label htmlFor="" className="w-25 mt-2">Room Id :</label>
                                    <input type="text" className="bg-white text-primary" onChange={(e) => setJoinId(e.target.value)} /><br />
                                    <label htmlFor="" className="w-25 mt-2">Password :</label>
                                    <input type="text" className="bg-white text-primary" onChange={(e) => setJoinPassword(e.target.value)} /><br />
                                    <button className="w-50 mt-3 ms-5">Join</button>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

        </div >
    )
};

export default Room;