import { Col, Row,Container} from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import WaitingRoom from './components/waitingroom';
import { useState } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import ChatRoom from './components/ChatRoom';

function App() {
  const [conn, setConnection] = useState();
  const [messages, setMessages] = useState([]);

  const joinChatRoom = async (username, chatroom) => {
    try {
      //initiate a connection
      const conn = new HubConnectionBuilder()
        .withUrl("http://localhost:5124/chat")
        .configureLogging(LogLevel.Information)
        .build();
    // set up handler 
      conn.on("JoinSpecificChatRoom", (username, msg) => {
        console.log("msg ", msg);
        
      })

      conn.on("ReceiveSpecificMessage", (username, msg) => {
        console.log("msg", msg);
        setMessages(messages => [...messages, { username, msg }]);
    });

      await conn.start();
      await conn.invoke("JoinSpecificChatRoom", {username, chatroom});

      setConnection(conn);

    } catch(e) {
      console.log(e);
    }
  }

  const sendMessage = async(message) => {
    console.log("msg ", message);
    try{
      await conn.invoke("SendMessage", message);
    }catch (e){
      console.log(e);
    }
  }

  console.log(messages);
  return (
    <div>
      <main>
        <Container>
          <Row class='px-5 my-5'>
            <Col sm='12'>
              <h1 className='font-weight-light'>Welcome to the ChatApp</h1>
            </Col>
          </Row>
          { !conn 
            ? <WaitingRoom joinChatRoom={joinChatRoom}></WaitingRoom>
            : <ChatRoom messages={messages} sendMessage={sendMessage}></ChatRoom>
          }
        </Container>
      </main>
    </div>
  );
}

export default App;
