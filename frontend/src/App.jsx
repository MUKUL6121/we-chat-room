// import Chat from './Group/chat.js';//Just a NORMAL connection to server for Group Chatting;
import Room from './Room/Room.jsx';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  return (
    <>
      {/* <Chat style={{ backgroundColor: '#ff0000ff' }} /> */}
      <Room />
    </>
  )
}
export default App;