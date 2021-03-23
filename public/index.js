const idForm = document.getElementById('id-form')
const idInput = document.getElementById('id-input')
const idSubmit = document.getElementById('id-submit')

idInput.focus()

idInput.addEventListener('input', () => {
	idSubmit.disabled = !idInput.value
})

idForm.addEventListener('submit', event => {
	event.preventDefault()

	if (idSubmit.disabled) return
	window.location.href = `/${idInput.value}`
})
