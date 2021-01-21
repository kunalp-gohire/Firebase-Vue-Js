export default {

    //auth
    userId(state) {
        return state.userId;
    },
    token(state) {
        return state.token;
    },
    isAuthenticated(state) {
        return !!state.token;
    },
    didAutoLogout(state) {
        return state.didAutoLogout;
    },
    
    //links
    links(state) {
        return state.links;
    },
    hasLinks(state) {
        return state.links.length > 0;
    },

    //files
    progress(state) {
        return state.progress;
    },
    files(state) {
        return state.files;
    },
    hasFiles(state) {
        return state.files.length > 0;
    },
};