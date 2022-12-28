const socket = io({autoConnect: false});
let playerName = "";

async function init() {


    //document.addEventListener('touchstart', onMouseClick, false);
    // document.addEventListener('click', onMouseClick, false);

    // playerName = getCookie('playerName');
    // if (playerName == null) {
    //   let defaultName = 'Player' + Math.floor(1000 + Math.random() * 9000);
    //   playerName = prompt('Enter your name: ', defaultName);
    //   if (playerName === null || playerName === "") {
    //     playerName = defaultName;
    //   } else {
    //     setCookie('playerName', playerName, 24 * 3600);
    //   }
    // }
    log("Init()");
    document.getElementById('startGame').onclick = startGame;
    playerName = document.getElementById('playerName').value;

    socket.connect();
}

// function setCookie(name, value, seconds) {
//   let date = new Date();
//   date.setTime(date.getTime() + (seconds * 1000));
//   let expires = "expires=" + date.toUTCString();
//   document.cookie = name + "=" + value + ";" + expires + ";path=/";
// }

// function getCookie(name) {
//   name += "=";
//   let cookies = document.cookie.split(';');
//   for(let i = 0; i < cookies.length; i++) {
//     let cookie = cookies[i];
//     while (cookie.charAt(0) === ' ') {
//       cookie = cookie.substring(1);
//     }
//     if (cookie.indexOf(name) === 0) {
//       return cookie.substring(name.length, cookie.length);
//     }
//   }
//   return null;
// }

socket.on('connect', requestRoom);
socket.on('gameStarted', gameStarted);


async function requestRoom() {
    log(`Entering game as ${playerName}`);
    let result = await promiseEmit(socket, 'enterGame', playerName);
    log(result);
}

async function startGame() {
    log("startGame");
    let result = await promiseEmit(socket, 'startGame');
    log(result);
}

async function gameStarted(state){
    log("gameStarted");
    log(state);   
}


async function chooseCards(cards){
    log("chooseCards");
    let result = await promiseEmit(socket, 'chooseCards', cards);
    log(result);   
}








function log(msg){
    console.log(msg);
    let result = "";
    if(msg === undefined){
        result = "undefined";
    } else if (msg === null){
        result = "null";
    } else {
        result = msg.toString();
    }
    document.getElementById('log').innerHTML += msg + '\n';
}

async function promiseEmit(sock, name, arg){
    return new Promise((resolve, reject) => {
        try{
            sock.emit(name, arg, function(result){
                resolve(result);
            });
        }catch(e){
            reject(e);
        }
    });
}