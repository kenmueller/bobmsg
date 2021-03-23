const title = document.getElementById('title')
const messages = document.getElementById('messages')

const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')
const messageSubmit = document.getElementById('message-submit')

const [, room] = window.location.pathname.match(/^\/([^\/]+)$/) || []
if (!room) throw new Error('Invalid Room ID')

const { FieldValue } = firebase.firestore
const firestore = firebase.firestore()

const collection = firestore.collection(`rooms/${room}/messages`)

const dateFormatters = {
	month: new Intl.DateTimeFormat('en-US', { month: 'short' }),
	day: new Intl.DateTimeFormat('en-US', { day: 'numeric' }),
	time: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' })
}

const formatDate = date => {
	const { month, day, time } = dateFormatters
	return `${month.format(date)} ${day.format(date)} at ${time.format(date)}`
}

const addMessage = ({ body, created }) => {
	const message = document.createElement('div')
	message.className = 'message'

	const messageTime = document.createElement('p')
	messageTime.className = 'message-time'
	messageTime.innerText = formatDate(created ? created.toDate() : new Date())

	const messageBody = document.createElement('p')
	messageBody.className = 'message-body'
	messageBody.innerText = body

	message.append(messageTime, messageBody)
	messages.append(message)
}

collection.orderBy('created').onSnapshot(
	snapshot => {
		for (const { type, doc } of snapshot.docChanges())
			if (type === 'added') addMessage(doc.data())

		messages.scrollTop = messages.scrollHeight
	},
	error => {
		console.error(error)
		alert(error.message)
	}
)

title.innerText = room
messageInput.focus()

const onMessageChange = () => {
	const { length } = messageInput.value
	messageSubmit.disabled = !(length > 0 && length <= 350)
}

messageInput.addEventListener('input', onMessageChange)

messageForm.addEventListener('submit', event => {
	event.preventDefault()
	if (messageSubmit.disabled) return

	collection.add({
		body: messageInput.value,
		created: FieldValue.serverTimestamp()
	})

	messageInput.value = ''
	onMessageChange()
})
