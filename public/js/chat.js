const socket = io()

socket.on('message', (message) => {
    console.log(message)
    const div = document.createElement('div')
    div.textContent = message
    document.querySelector('#messages').appendChild(div)
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const a = document.createElement('a')
    a.href = message
    a.textContent = 'My current location'
    document.querySelector('#messages').appendChild(a)

})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message)
})

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    })
})