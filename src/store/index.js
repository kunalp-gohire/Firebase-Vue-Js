import { createStore } from 'vuex';

import actions from './actions.js';
import mutations from './mutations.js';
import getters from './getters.js';

const store = createStore({
    state() {
        return {
            links: [

            ],
            files: [

            ],
            progress: 0,
            userId: null,
            token: null,
            tokenExpiration: null,
            didAutoLogout: false
        };
    },
    actions,
    mutations,
    getters
});

export default store;