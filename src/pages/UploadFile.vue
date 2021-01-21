<template>
  <base-card>
    <form @submit.prevent="UploadFile">
      <div class="form-control">
        <label for="title">Title</label>
        <input type="text" id="title" v-model.trim="title" />
      </div>
      <div class="form-control">
        <label for="image">Upload Image</label>
        <base-button @click="onPickFile">Select File</base-button>
        <input
          type="file"
          style="display: none"
          ref="fileInput"
          @change="onFilePicked"
        />
      </div>
      <div class="form-control">
        <base-card v-if="file">
          <img :src="fileUrl" height="150" />
        </base-card>
      </div>
      <base-card v-if="file">
        <p>
          Progress: {{ uploadValue + "%" }}
          <progress id="progress" :value="uploadValue" max="100"></progress>
        </p>
      </base-card>
      <div class="form-control">
      <base-button>Upload</base-button>
      </div>
    </form>
  </base-card>
</template>

<script>
export default {
  data() {
    return {
      title: null,
      fileUrl: null,
      file: null,
    };
  },
  created(){
    // console.log('reset');
    this.$store.dispatch('resetProgress');
  },
  computed: {
    uploadValue() {
      return Math.round(this.$store.getters.progress);
    },
  },
  
  watch: {
    uploadValue(val) {
      if (val === 100) {
        // console.log("redirect");
        this.$router.replace("/filelist");
      }
    },
  },
  methods: {
    UploadFile() {
      if (!this.file) return;
      const fileData = {
        title: this.title,
        file: this.file,
      };
      this.$store.dispatch("uploadFile", fileData);
    },
    onPickFile() {
      this.$refs.fileInput.click();
    },
    onFilePicked(event) {
      const files = event.target.files;
      let filename = files[0].name;
      if (filename.lastIndexOf(".") <= 0) {
        return alert("Please add valid file");
      }
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.fileUrl = fileReader.result;
      });
      fileReader.readAsDataURL(files[0]);
      this.file = files[0];
    },
  },
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