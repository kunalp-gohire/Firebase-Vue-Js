<template>
<base-card>
  <form @submit.prevent="submitForm">
    <div class="form-control">
      <label for="title">Title</label>
      <input type="text" id="title" v-model.trim="title" />
    </div>
    <div class="form-control">
      <label for="link">Link</label>
      <input type="link" id="link" v-model.trim="link" />
    </div>
    <p v-if="!formIsValid">Please Enter Valid Input</p>
    <div class="actions">
      <base-button>Upload</base-button>
    </div>
  </form>
</base-card>
</template>

<script>
export default {
    data(){
        return{
            title:'',
            link:'',
            formIsValid:true
        };
    },
    
    methods:{
        submitForm(){
            
            this.$store.dispatch('addLink',{
                title:this.title,
                link:this.link
            });
            this.title='';
            this.link='';
            this.$router.replace('/');
        }
    }
};
</script>

<style scoped>
form {
  margin: 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}

.errors {
  font-weight: bold;
  color: red;
}

.actions {
  text-align: center;
}
</style>