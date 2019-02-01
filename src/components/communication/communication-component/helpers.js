import { getUserDetails } from "../../../api/pros";
import { generateJID } from "../../../utils";

export const setMessages = (id, text, isMy, prevState) => ({
    chats: {
		...prevState.chats, 
		[id]: prevState.chats[id] ? [ 
			...prevState.chats[id], 
			{ text, isMy } 
		] : [ { text, isMy } ],
	}
});


export const setUser = (user, prevState) => ({
    users: {
		...prevState.users, 
		[user.id]: { ...user },
	}
});

export const getUserInfo = async (id, userAuth, props) => {
	const pro = props.user.pro || {};
	const _id = id.split('@')[0];
	const isPro = (Object.keys(pro).length === 0);

	return await getUserDetails(_id, userAuth, isPro);
}

export const prepareFromTo = (props) => {
	const { user, comModal } = props;
	const to = generateJID(comModal.person.id);
	const from = generateJID(user.id);

	return {from, to};
}