const socket = io()

const form = document.querySelector('#message-form')
const messageInput = form.querySelector('input[name="message"]')
const formButton = form.querySelector('button')

const messageContainer = document.querySelector('#messages')

const locationButton = document.querySelector('#send-location')

socket.on('message', (message) => {
    console.log(message)
    const div = document.createElement('div')
    div.textContent = message
    messageContainer.appendChild(div)
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const a = document.createElement('a')
    a.href = messageInput.value
    a.textContent = 'My current location'
    messageContainer.appendChild(a)

})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    formButton.setAttribute('disabled', 'disabled')
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {
        formButton.removeAttribute('disabled')
        messageInput.value = ''
        messageInput.focus()
        if (error) {
            return console.log(error)
        }
        console.log('Message delivered!')
    })
})

locationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }
    locationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            locationButton.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })
})