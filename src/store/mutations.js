export default {
    //auth
    setUser(state, payload) {
        state.token = payload.token;
        state.userId = payload.userId;
    },
    setAutoLogout(state) {
        state.didAutoLogout = true;
    },
    // setUserId(state,payload){
    //     state.userId = payload;
    // },

    //links
    addLink(state, payload) {
        if (!state.links.find((ele) => ele.id === payload.id)) {
            state.links.unshift({
                id: payload.id,
                title: payload.title,
                link: payload.link,
                userId: payload.userId,
            });
        }
    },
    updateLinks(state, payload) {
        const resIndex = state.links.findIndex(res => res.id === payload);
        // console.log(resIndex);
        if (resIndex != -1) {
            state.links.splice(resIndex, 1);
        }

    },
    loadlinks(state, payload) {

        state.links = payload;
    },

    //files
    loadFiles(state, payload) {
        state.files = payload;
    },
    uploadFile(state, payload) {
        // if(this.file.indexOf(file) === -1)
        state.files.push(payload);
    },
    progress(state, payload) {
        state.progress = payload;
    },
    updateFiles(state, payload) {
        const resIndex = state.files.findIndex(res => res.id === payload);
        // console.log(resIndex);
        if (resIndex != -1) {
            state.files.splice(resIndex, 1);
        }
    },
};