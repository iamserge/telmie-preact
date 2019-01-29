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
})