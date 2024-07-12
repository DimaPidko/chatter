import { useSelector, useDispatch } from 'react-redux';
import { setChatName } from './FormToCreateChatSlice.ts'

const FormToCreateChat = () => {
	const { chatName } = useSelector((state) => state.form)
	const dispatch = useDispatch()
	
	async function onSubmitCreateChat(e) {
		e.preventDefault()
		return chatName
	}
	
	return (
		<form onSubmit={(e) => onSubmitCreateChat(e).then((data) => console.log(data))}>
			<h2>Here you can create new chat!</h2>
			<input placeholder={"Enter chat name..."} onChange={(e) => dispatch(setChatName(e.target.value))}/>
			<button>Create</button>
		</form>
	)
}

export default FormToCreateChat