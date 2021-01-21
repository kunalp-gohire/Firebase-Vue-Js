import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js';
import store from './store/index.js';
// import firebase from './firebase.js';
require('dotenv').config();

import BaseCard from './components/UI/BaseCard.vue';
import BaseButton from './components/UI/BaseButton.vue';
import BaseSpinner from './components/UI/BaseSpinner.vue';
import BaseDialog from './components/UI/BaseDialog.vue';
import ConfirmDelete from './components/UI/ConfirmDelete.vue';

const app=createApp(App);


app.use(router);
app.use(store);
// app.use(firebase);

app.component('base-card',BaseCard);
app.component('base-button',BaseButton);
app.component('base-spinner',BaseSpinner);
app.component('base-dialog',BaseDialog);
app.component('confirm-delete',ConfirmDelete);


app.mount('#app');
