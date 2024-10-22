const socket = io()

const form = document.querySelector('#message-form')
const messageInput = form.querySelector('input[name="message"]')
const formButton = form.querySelector('button')
const locationButton = document.querySelector('#send-location')

const messageContainer = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML


socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messageContainer.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messageContainer.insertAdjacentHTML('beforeend', html)
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