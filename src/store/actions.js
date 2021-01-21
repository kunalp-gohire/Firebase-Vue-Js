import db from '../firebase';
import st from 'firebase/app';
import 'firebase/storage'
import 'firebase/auth'

let timer;
export default {
    async login(context, payload) {
        return context.dispatch('auth', {
            ...payload,
            mode: 'login'
        });
    },
    async signup(context, payload) {
        return context.dispatch('auth', {
            ...payload,
            mode: 'signup'
        });

    },
    async auth(context, payload) {
        const mode = payload.mode;
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+process.env.VUE_APP_API_KEY;
        if (mode === 'signup') {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+process.env.VUE_APP_API_KEY;
        }
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                email: payload.email,
                password: payload.password,
                returnSecureToken: true
            })
        });

        const responseData = await response.json();

        if (!response.ok) {
            const error = new Error(
                responseData.message || 'Failed to authenticate. Check your login data.'
            );
            throw error;
        }

        const expiresIn = +responseData.expiresIn * 1000;
        // const expiresIn = 5000;
        const expirationDate = new Date().getTime() + expiresIn;

        localStorage.setItem('token', responseData.idToken);
        localStorage.setItem('userId', responseData.localId);
        localStorage.setItem('tokenExpiration', expirationDate);

        timer = setTimeout(function () {
            context.dispatch('autoLogout');
        }, expiresIn);

        context.commit('setUser', {
            token: responseData.idToken,
            userId: responseData.localId
        });
        // context.dispatch('setUserId',responseData.localId)
    },
   
    logout(context) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('tokenExpiration');

        clearTimeout(timer);

        context.commit('setUser', {
            token: null,
            userId: null
        });
    },
    autoLogout(context) {
        context.dispatch('logout');
        context.commit('setAutoLogout');
    },
    tryLogin(context) {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const tokenExpiration = localStorage.getItem('tokenExpiration');
    
        const expiresIn = +tokenExpiration - new Date().getTime();
    
        if (expiresIn < 0) {
          return;
        }
    
        timer = setTimeout(function() {
          context.dispatch('autoLogout');
        }, expiresIn);
    
        if (token && userId) {
          context.commit('setUser', {
            token: token,
            userId: userId
          });
        }
      },



    //files

    realTimeUpdateFiles(context) {
        const userId = localStorage.getItem('userId');
        db.collection("files")
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === "added") {
                        const source = change.doc.metadata.hasPendingWrites ? "Local" : "Server";
                        if (source === 'Server') {
                            if ('' + userId === change.doc.data().userId) {
                                context.commit('uploadFile', {
                                    id: change.doc.id,
                                    userId: change.doc.data().userId,
                                    title: change.doc.data().title,
                                    link: change.doc.data().link,
                                });
                                
                            }
                        }
                    }
                    if (change.type === "modified") {
                        // console.log("Modified: ", change.doc.data());
                    }
                    if (change.type === "removed") {
                        // console.log("Removed: ", change.doc.data());
                        context.commit('updateFiles', change.doc.id);
                    }
                });
            });
    },


    async uploadFile({ commit, getters }, payload) {
        const userId = getters.userId;
        const fileData = {
            title: payload.title,
            userId: userId,
            date: new Date()
        };
        let fileUrl;
        let key;

        await db.collection('files').add(fileData)
            .then((data) => {
                key = data.id
                return key;
            })
            .then(() => {
                const filename = payload.file.name;
                var storageRef = st.storage().ref();
                const ext = filename.slice(filename.lastIndexOf('.'));
                const Filename = key + '' + ext;
                var uploadTask = storageRef.child('files/' + Filename).put(payload.file);

                uploadTask.on('state_changed', (snapshot) => {


                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    commit('progress', progress);


                }, (error) => {
                    console.log(error);
                }, () => {

                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        // console.log('File available at', downloadURL);
                        fileUrl = downloadURL.toString();
                        db.collection('files').doc(key).update({ fileUrl: fileUrl, fileName: Filename })
                    });
                });

                // console.log(uploadTask);
                return Filename;
            })
            .then((Filename) => {
                commit('uploadFile', {
                    ...fileData,
                    fileUrl: fileUrl,
                    fileName: Filename,
                    id: key
                });
            })
            .catch((error) => {
                console.log(error);
            })
    },

    async loadFiles(context) {
        const userId = context.getters.userId;
        await db.collection('files').get()
            .then(querySnapshot => {
                let tempFiles = []
                querySnapshot.forEach(doc => {
                    if ("" + userId === doc.data().userId) {
                        const data = {
                            id: doc.id,
                            title: doc.data().title,
                            fileUrl: doc.data().fileUrl,
                            userId: doc.data().userId,
                            fileName: doc.data().fileName,
                            date: doc.data().date
                        };
                        tempFiles.push(data);
                        // console.log(tempFiles);
                    }
                })
                const tempFilesSorted = tempFiles.sort((a, b) => {
                    return b.date.seconds - a.date.seconds
                });
                // console.log("load")
                context.commit('loadFiles', tempFilesSorted);
            }).catch((error) => {
                console.error("Error writing document: ", error);
            });
    },


    async deleteFile(context, payload) {
        var storageRef = st.storage().ref();
        // console.log(payload.fileName);
        var desertRef = storageRef.child('files/' + payload.fileName);

        await desertRef.delete().then(() => {
            // console.log("deleted")
        }).catch((error) => {
            console.log(error);
        });

        await db.collection('files').doc(payload.id).delete()
            .then(() => {
                context.commit('updateFiles', payload.id);
            }).catch((error) => {
                console.error("Error writing document: ", error);
            });

    },

    resetProgress(context) {
        context.commit('progress', 0);
    },

    realTimeUpdate(context) {
        const userId = context.getters.userId;
        db.collection("links_collection")
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === "added") {
                        const source = change.doc.metadata.hasPendingWrites ? "Local" : "Server";
                        if (source === 'Server') {
                            // console.log(userId);
                            // console.log("doc", change.doc.data().userId);
                            if (userId === change.doc.data().userId) {
                                // console.log(userId === change.doc.data().userId);
                                // context.dispatch('loadlinks');
                                context.commit('addLink', {
                                    id: change.doc.id,
                                    title: change.doc.data().title,
                                    userId: change.doc.data().userId,
                                    link: change.doc.data().link,
                                });
                                
                                // console.log(change.doc.data().title);
                            }
                            // console.log("real",change.doc.data().title);
                        }
                       
                    }
                    if (change.type === "modified") {
                        // console.log("Modified: ", change.doc.data());
                    }
                    if (change.type === "removed") {
                        // console.log("Removed: ", change.doc.data());
                        context.commit('updateLinks', change.doc.id);
                    }
                });
            });
    },
    async loadlinks(context) {
        const userId = context.getters.userId;
        await db.collection('links_collection').get()
            .then(querySnapshot => {
                let templinks = []
                
                querySnapshot.forEach(doc => {
                    if (userId === doc.data().userId) {
                        const data = {
                            id: doc.id,
                            title: doc.data().title,
                            link: doc.data().link,
                            userId: doc.data().userId,
                            date: doc.data().date
                        };
                        templinks.push(data);
                    }
                });
                const templinksSorted = templinks.sort((a, b) => {
                    return b.date.seconds - a.date.seconds
                });
                // console.log("load")
                context.commit('loadlinks', templinksSorted);
            }).catch((error) => {
                console.error("Error writing document: ", error);
            });

    },
    addLink(context, payload) {
        // console.log("ad")
        const userId = context.getters.userId;
        db.collection('links_collection').add({
            title: payload.title,
            link: payload.link,
            userId: userId,
            date: new Date()
        })
            .then(docRef => {
                context.commit('addLink', {
                    id: docRef.id,
                    title: payload.title,
                    userId: userId,
                    link: payload.link,
                });
            }).catch((error) => {
                console.error("Error writing document: ", error);
            });
    },
    deleteLink(context, payload) {
        db.collection('links_collection').doc(payload.id).delete()
            .then(() => {
                context.commit('updateLinks', payload.id);
            }).catch((error) => {
                console.error("Error writing document: ", error);
            });
    },




};