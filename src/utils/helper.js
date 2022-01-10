export const formatTime = (timer) => {
    const getMiliseconds = `0${Math.floor(timer/10) % 100}`.slice(-2)
    const getSeconds = `0${Math.floor(timer / 1000) % 60}`.slice(-2)
    const getMinutes = `0${Math.floor(timer / 60000) % 60}`.slice(-2)
    const getHours = `0${Math.floor(timer / 3600000)}`.slice(-2)
  
    return `${getHours} : ${getMinutes} : ${getSeconds} : ${getMiliseconds}`
  }