import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { io } from "socket.io-client";
function App() {
  const [socket, setSocket] = useState();
  const [userName, setUserName] = useState('');
  const [inUserName,setInUserName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [userInput, setUserInput] = useState('');

  function connectToServer(){
    console.log(`connectToServer`);
    const _socket = io('http://localhost:3000',{
      autoConnect: false,
      query: {
        userName: userName,
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
    console.log('front - on connected')
    setIsConnected(true);
  }  
  function disConnected(){
    console.log('front - on disconnected')
    setIsConnected(false);
  }
  function sendMsgToServer(){
    console.log(`msg front input: ${userInput}`);
  }
  useEffect(()=>{
    console.log('useEffect called');
    socket?.on('connect', onConnected);
    socket?.on('disconnect', disConnected);
    return() =>{
      //clean up function ...
      socket?.off('connect', onConnected);
      socket?.on('disconnect', disConnected);
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
        <input value={inUserName} onChange={e => setInUserName(e.target.value)}/>
        <button onClick={function(e){
          if(inUserName === '') return;
          connectToServer();
          setUserName(inUserName);
          e.preventDefault();
        }}>
          접속
        </button>
        <button onClick={function(e){
          disConnectToServer();
          setUserName('');
          e.preventDefault();
        }}>
          접속 종료
        </button>
        {/* <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p> */}
      </div>
      <div className="card">
        <input type="text" value={userInput} onChange={e => setUserInput(e.target.value)}/>
        <button onClick={function(){
          if(isConnected === false) return;
          sendMsgToServer();
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