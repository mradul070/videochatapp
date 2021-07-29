
const socket = io('/')


const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video')
myVideo.muted = true

const peer = new Peer(undefined, {   
    host: 'localhost',
    port: '3000',
    path: '/peerjs'
})
console.log(peer)


peer.on('open', id=> {
    console.log(id)
    socket.emit('join-room', ROOM_ID, id)
})

let myVidestream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVidestream = stream
    addVideoStream(myVideo, stream)
    console.log(peer)
    peer.on('call' , call => {
        console.log('peer1')
        call.answer(myVidestream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            console.log('stream1')
            addVideoStream(video, userVideoStream)
        })
    })
    socket.on('user-connected', (userId) => {
        console.log('data')
        connectToNewUser(userId, myVidestream)
    })
})



const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    console.log(call)
    peer.on('call' , call => {
        console.log('3')
        call.answer(myVidestream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            console.log('2')
            addVideoStream(video, userVideoStream)
        })
    })
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        console.log('2')
        // addVideoStream(video, userVideoStream)
    }) 
}

const addVideoStream = (video, stream) => {
    console.log('1')
    video.srcObject = stream
    video.addEventListener('loadedmetadata', ()=>{
        video.play()
    })
    videoGrid.append(video)
}


