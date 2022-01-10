import { useEffect, useRef, useState } from 'react';
import { io } from "socket.io-client";
import * as uuid from 'uuid';

const socket = io('http://localhost:3333',{transports: ['websocket'], upgrade: false})



const useTimer = (initialState = 0) => {
  let room = ''
  const [timer, setTimer] = useState(initialState)
  const [roomName, setRoomName] = useState(room)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const countRef = useRef(null)
  const timerUpdater = useRef()
  
  
  const createRoom = () => {
    room = uuid.v4()
    setRoomName(room)
    socket.emit('createRoom', room)
  }

  const joinRoom = (room) => {
    socket.emit('joinRoom', room)
  }

  const leaveRoom = () => {
    socket.emit('leaveRoom', room)
  }

  const handleStart = () => {
    setIsActive(true)
    setIsPaused(true)
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 10)
    }, 10)
  }

  const handlePause = () => {
    clearInterval(countRef.current)
    setIsPaused(false)
  }

  const handleResume = () => {
    setIsPaused(true)
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 10)
    }, 10)
  }

  const handleReset = () => {
    clearInterval(countRef.current)
    setIsActive(false)
    setIsPaused(false)
    setTimer(0)
  }

  const start = (room) => {handleStart();socket.emit('startTimer', room)}
  const pause = (room) => {handlePause();socket.emit('pauseTimer', room)}
  const resume = (room) => {handleResume();socket.emit('resumeTimer', room)}
  const reset = (room) => {handleReset();socket.emit('resetTimer', room)}
  const desync = () => {clearInterval(countRef.current)}

  useEffect(() => {
    if(timer%5000 === 0 ){
      socket.emit('sync', timer)
    }
    timerUpdater.current = timer
  }, [timer])

  useEffect(() => {
    socket.on('timerStarted', () => {
      handleStart()
      console.log('Timer Started')
    })
    
    socket.on('timerPaused', () => {
      handlePause()
      console.log('Timer Paused')
    })
    
    socket.on('timerResumed', () => {
      handleResume()
      console.log('Timer Resumed')
    })
    
    socket.on('timerReseted', () => {
      handleReset()
      console.log('Timer Reseted')
    })
    
    socket.on('syncing', (data) => {
      if(Math.abs(timerUpdater.current-data) > 1000){
        console.log(`You're desynced from your colleague`)
        handlePause()
        socket.emit('pauseTimer')
        console.log(`We're trying to sync you both again`)

        setTimeout(function () {
          setTimer(data)
          console.log(`You're now synced, please proceed`)
        }, 5000);
      }
    })

    socket.on('timerStarted', () => {
      handleStart()
      console.log('Timer Started')
    })

    socket.on('roomJoined', (data) => {
      console.log(`You're connected to ${data} room`)
    })
    socket.on('roomLeaved', (data) => {
      console.log(`You're left ${data} room`)
    })
    
  }, []) 
  

  return { timer, roomName, isActive, isPaused, start, pause, resume, reset, desync, createRoom, joinRoom, leaveRoom }
}

export default useTimer