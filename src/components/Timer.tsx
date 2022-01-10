import { faClock } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import useTimer from '../hooks/useTimer';
import { formatTime } from '../utils/helper';

const element = <FontAwesomeIcon icon={faClock} />


const Timer = () => {
  const { timer, roomName, isActive, isPaused, start, pause, resume, reset, desync, createRoom, joinRoom, leaveRoom} = useTimer(0)

  const [connected_room, setRoomConnect] = useState(roomName)
  
  const handleSubmit = (event: any) => {
    event.preventDefault();
    joinRoom(connected_room)
  }

  return (
    <div className="app">
      <h3>React Stopwatch {element}</h3>
      <div className='stopwatch-card'>
        <p>{formatTime(timer)}</p>
        <div className='buttons'>
          {
            !isActive && !isPaused ?
              <button onClick={() => {start(connected_room)}}>Start</button>
              : (
                isPaused ? <button onClick={() => {pause(connected_room)}}>Pause</button> :
                  <button onClick={() => {resume(connected_room)}}>Resume</button>
              )
          }
          <button onClick={() => {reset(connected_room)}} disabled={!isActive}>Reset</button>
          <button onClick={desync}>Desync</button>
          <button onClick={createRoom}>Create Room</button>
        </div>
        <p>Room Name: {roomName}</p>
        <form action="" onSubmit={handleSubmit}>
          <input type="text" onChange={(e) =>{setRoomConnect(e.target.value)}}/>
          <input type="submit" name="Conectar"/>
        </form>
        <button onClick={leaveRoom}>Leave Room</button>
      </div>
      
    </div>
  )
}

export default Timer;