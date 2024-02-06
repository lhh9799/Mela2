import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import InboxList from "../components/InboxList";
import MessageFrom from "../components/MessageFrom";
import styled from "styled-components";
import axios from "axios";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const Container = styled.div`
  display: flex;
  width: 100%;
`;

const MessageFromWrapper = styled.div`
  color: white;
  flex: 3;
`;

const InboxWrapper = styled.div`
  background-color: #151c2c;
  color: white;
  flex: 1;
`;

function Message() {
  const [roomName, setRoomName] = useState("");
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    findAllRooms();
  }, []);

  const findAllRooms = () => {
    axios
      .get("http://localhost:8080/api/v1/chat/rooms")
      .then((response) => setChatRooms(response.data))
      .catch((error) => console.error("Error fetching chat rooms:", error));
  };

  const createRoom = () => {
    if (roomName === "") {
      alert("방 제목을 입력해 주세요.");
      return;
    } else {
      // const params = new URLSearchParams();
      // params.append("name", roomName);
      const params = roomName;
      axios
        .post("http://localhost:8080/api/v1/chat/room", params)
        .then((response) => {
          alert(`${response.data.name} 방 개설에 성공하였습니다.`);
          setRoomName("");
          findAllRooms();
        })
        .catch((response) => alert("채팅방 개설에 실패하였습니다."));
    }
  };

  const enterRoom = (roomIdx) => {
    const userIdx = prompt("대화명을 입력해 주세요.");
    if (userIdx !== "") {
      localStorage.setItem("wschat.userIdx", userIdx);
      localStorage.setItem("wschat.roomIdx", roomIdx);
      //   window.location.href = `/message/${roomIdx}`;
    }
  };

  // -----------------------
  const [roomIdx, setRoomIdx] = useState("");
  const [room, setRoom] = useState({});
  const [userIdx, setUserIdx] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  let sock = new SockJS("//localhost:8080/ws-stomp");
  let ws = Stomp.over(sock);
  let reconnect = 0;

  useEffect(() => {
    setRoomIdx(localStorage.getItem("wschat.roomIdx"));
    setUserIdx(localStorage.getItem("wschat.userIdx"));
    findRoom();
    connect();
  }, []);

  const findRoom = () => {
    axios
      .get(`/chat/room/${roomIdx}`)
      .then((response) => setRoom(response.data))
      .catch((error) => console.error("Error fetching room:", error));
  };

  const sendMessage = () => {
    // connect();
    console.log("ws.connected: " + ws.connected);
    console.log("ws.connected: " + ws.connected);

    if (ws && ws.connected) {
      ws.send("/pub/chat/message", {}, JSON.stringify({ type: "TALK", roomIdx, userIdx, message }));
      setMessage("");
    } else {
      // WebSocket 연결이 설정되지 않은 경우, 메시지를 보낼 수 없음을 사용자에게 알림
      console.error("WebSocket 연결이 설정되지 않았습니다.");
      connect();
    }
  };

  const recvMessage = (recv) => {
    setMessages([
      {
        type: recv.type,
        userIdx: recv.type === "ENTER" ? "[알림]" : recv.userIdx,
        message: recv.message,
      },
      ...messages,
    ]);
  };

  const connect = () => {
    // sock = new SockJS("/ws-stomp");
    sock = new SockJS("//localhost:8080/ws-stomp");
    ws = Stomp.over(sock);

    ws.connect(
      {},
      (frame) => {
        ws.subscribe(`/sub/chat/room/${roomIdx}`, (message) => {
          const recv = JSON.parse(message.body);
          recvMessage(recv);
        });
        ws.send("/pub/chat/message", {}, JSON.stringify({ type: "ENTER", roomIdx, userIdx }));
        ws.send(
          "/pub/chat/message",
          {},
          JSON.stringify({ type: "TALK", roomIdx, userIdx, message })
        );
        setMessage("");

        console.log("frame?? ");
      },
      (error) => {
        if (reconnect++ <= 5) {
          setTimeout(() => {
            console.log("connection reconnect");
            connect();
          }, 10 * 1000);
        }
      }
    );

    console.log("connect()!!!" + ws.connected);
  };

  return (
    <Container>
      <div className="row">
        <div className="col-md-12">
          <h3>채팅방 리스트</h3>
        </div>
      </div>
      <div className="input-group">
        <div className="input-group-prepend">
          <label className="input-group-text">방제목</label>
        </div>
        <input
          type="text"
          className="form-control"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && createRoom()}
        />
        <div className="input-group-append">
          <button className="btn btn-primary" type="button" onClick={createRoom}>
            채팅방 개설
          </button>
        </div>
      </div>
      <ul className="list-group">
        {chatRooms.map((room) => (
          <li
            key={room.roomIdx}
            className="list-group-item list-group-item-action"
            onClick={() => enterRoom(room.roomIdx)}
          >
            {room.name}
=======
import InboxList from '../components/InboxList'
import MessageFrom from '../components/MessageFrom'
import styled from "styled-components";
import axios from 'axios';
import SockJS from "sockjs-client";
import {Client} from "@stomp/stompjs";

let ACCESS_TOKEN = localStorage.getItem('accessToken')
const WEBSOCKET_URL = '/ws-stomp';

export const ChatAPI = axios.create({
  baseURL: 'http://localhost:8080/api/v1/chat',
  headers: {
      'Content-Type': 'application/json',
      //   'Authorization': `Bearer ${ACCESS_TOKEN}`,
  },
})

function Message() {
  const [roomName, setRoomName] = useState('');
  const [chatrooms, setChatrooms] = useState([]);

  useEffect(() => {
    findAllRoom();
  }, []);

  const findAllRoom = () => {
    ChatAPI.get('/rooms').then((response) => {
      setChatrooms(response.data);
    });
  };


  const enterRoom = (roomIdx) => {
    const sender = prompt('대화명을 입력해 주세요.');
    localStorage.setItem('wschat.sender', sender);
    localStorage.setItem('wschat.roomIdx', roomIdx);
    // window.location.href = `/chat/room/enter/${roomIdx}`;
  };

  // ------------------------------------------------
  
  const [roomIdx, setRoomIdx] = useState(localStorage.getItem('wschat.roomIdx') || '');
  const [room, setRoom] = useState({});
  const [sender, setSender] = useState(localStorage.getItem('wschat.sender') || '');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  let sock = new SockJS("/ws-stomp");
//   let sock = new SockJS("/ws/chat");
//   let sock = new SockJS("http://localhost:8080/ws-stomp");
//   let sock = new SockJS("http://localhost:8080/api/v1/chat");

  let ws = new Client({
    webSocketFactory : ()=> sock
  })
  let reconnect = 0;

  useEffect(() => {
    findRoom();
    connect();

    return () => {
      ws.deactivate();
    };
  }, []);

  const findRoom = () => {
    axios.get(`http://localhost:8080/chat/room/${roomIdx}`).then(response => {
      setRoom(response.data);
    });
  };

  const sendMessage = () => {
    ws.publish({destination: "/pub/chat/message", body: JSON.stringify({ type: 'TALK', roomIdx, sender, message })});
    setMessage('');
  };

  const recvMessage = (recv) => {
    setMessages([{ type: recv.type, sender: recv.type === 'ENTER' ? '[알림]' : recv.sender, message: recv.message }, ...messages]);
  };

  const connect = () => {
    ws.onConnect = (frame) => {
      ws.subscribe(`/sub/chat/room/${roomIdx}`, (message) => {
        const recv = JSON.parse(message.body);
        recvMessage(recv);
      });
      ws.publish({destination: "/pub/chat/message", body: JSON.stringify({ type: 'ENTER', roomIdx, sender })});
    }

    ws.onStompError = (error) => {
      if (reconnect++ <= 5) {
        setTimeout(() => {
          console.log("connection reconnect");
          sock = new SockJS("/ws-stomp");
          ws = new Client({
            webSocketFactory : ()=> sock
          });
          connect();
        }, 10 * 1000);
      }
    };

    ws.activate();
  };

  return(
    <Container>

      <ul className="list-group">
        {chatrooms.map((item) => (
          <li
            key={item.roomIdx}
            className="list-group-item list-group-item-action"
            onClick={() => enterRoom(item.roomIdx)}
          >
            {item.name}
>>>>>>> be1f5a03c83f0803d13079696cab6c3650389398
          </li>
        ))}
      </ul>

      <div className="container">
<<<<<<< HEAD
        <div>
          <h2>{room.name}</h2>
        </div>
        <div className="input-group">
          <div className="input-group-prepend">
            <label className="input-group-text">내용</label>
          </div>
          <input
            type="text"
            className="form-control"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <div className="input-group-append">
            <button className="btn btn-primary" type="button" onClick={sendMessage}>
              보내기
            </button>
          </div>
        </div>
        <ul className="list-group">
          {messages.map((message, index) => (
            <li key={index} className="list-group-item">
              {message.userIdx} - {message.message}
            </li>
          ))}
        </ul>
        <div></div>
      </div>
=======
      <div>
        <h2>{room.name}</h2>
      </div>
      <div className="input-group">
        <div className="input-group-prepend">
          <label className="input-group-text">내용</label>
        </div>
        <input
          type="text"
          className="form-control"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
        />
        <div className="input-group-append">
          <button className="btn btn-primary" type="button" onClick={sendMessage}>
            보내기
          </button>
        </div>
      </div>
      <ul className="list-group">
        {messages.map((msg, index) => (
          <li key={index} className="list-group-item">
            {msg.sender} - {msg.message}
          </li>
        ))}
      </ul>
      <div></div>
    </div>
>>>>>>> be1f5a03c83f0803d13079696cab6c3650389398

      <MessageFromWrapper>
        <MessageFrom />
      </MessageFromWrapper>
      <InboxWrapper>
        <InboxList />
      </InboxWrapper>
<<<<<<< HEAD
    </Container>
  );
}

export default Message;
=======
    </Container>      
  )
}

const Container = styled.div`
  display: flex;
  width: 100%;
`

const MessageFromWrapper = styled.div`
  color: white;
  flex: 3;
`

const InboxWrapper = styled.div`
  background-color: #151C2C;
  color: white;
  flex: 1;
`
export default Message
>>>>>>> be1f5a03c83f0803d13079696cab6c3650389398
