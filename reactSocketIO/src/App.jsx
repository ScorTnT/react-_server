import { useState, useEffect } from 'react'
import { io } from "socket.io-client";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [socket, setSocket] = useState();
  const [userName, setUserName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [userInput, setUserInput] = useState('');

  function connectToServer(){
    if(userName==='') return;
    console.log(`connectToServer`);
    const _socket = io('http://localhost:3000',{
      autoConnect: false,
      query: {
        user: userName,
      }
    });
    _socket.connect();
    setSocket(_socket);
  }

  function disConnectToServer(){
    console.log(`disConnectToServer`);
    socket?.disconnect();
  }

  function onConnected(){
    console.log('front - on connected');
    setIsConnected(true);
  }  
  function disConnected(){
    console.log('front - on disconnected');
    setIsConnected(false);
  }
  function sendMsgToServer(){
    if(userInput==='') return;
    console.log(`msg front input: ${userInput}`);
    socket?.emit("new message",{user:userName, msg:userInput},(response)=>{
      console.log(response);
    });
  }
  function onMessageReceived(msg){
    console.log(msg);
  }
  useEffect(()=>{
    // console.log('useEffect called');
    socket?.on('connect', onConnected);
    socket?.on('disconnect', disConnected);
    socket?.on('new message', onMessageReceived);
    return() =>{
      //clean up function ...
      socket?.off('connect', onConnected);
      socket?.off('disconnect', disConnected);
      socket?.off('new message', onMessageReceived);
    };
  },[socket]);
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>User :{userName}</h1>
      <h2>접속상태 :{isConnected ? "접속중" : "미접속"}</h2>

      <div className="card">
        <input placeholder = "user name" value={userName} onChange={e => setUserName(e.target.value)}/>
        <button onClick={function(){
          if(userName === '') {
            alert("put user name");
            return;
          }
          if(isConnected === true) { alert(`already connected name:${lastName}`); return; }
          setLastName(userName);
          connectToServer();
          onConnected();
        }}>
          접속
        </button>
        <button onClick={function(){
          disConnected();
          disConnectToServer();
          setUserName('');
        }}>
          접속 종료
        </button>
        {/* <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p> */}
      </div>

      <div className="card">
        <input type="text" placeholder='message' value={userInput} onChange={e => setUserInput(e.target.value)}/>
        <button onClick={function(){
          if(isConnected === false) { return; }
          if(userName !== lastName) { return; }
          sendMsgToServer();
          setUserInput('');
        }}>
          보내기
        </button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App