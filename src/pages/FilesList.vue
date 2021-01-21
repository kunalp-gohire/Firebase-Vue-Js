<template>
  <div>
    <base-card>
      <div class="controls">
        <base-button mode="outline" @click="refresh"> Refresh </base-button>
        <base-button link to="/upload">Upload</base-button>
      </div>

      <!-- <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div> -->
      
       <transition-group v-if="hasFiles" tag="ul" name="user-list">
          <file-item
            v-for="file in files"
            :key="file.id"
            :id="file.id"
            :title="file.title"
            :fileUrl="file.fileUrl"
            :fileName="file.fileName"
          >
          </file-item>
       </transition-group>
      
      <div v-else><h2>No Files added</h2></div>
    </base-card>
  </div>
</template>

<script>
import FileItem from "../components/Files/FileItem.vue";
export default {
  components: { FileItem },

  computed: {
    files() {
      const files = this.$store.getters.files;
      return files;
    },
    hasFiles() {
      return this.$store.getters.hasFiles;
    },
  },
  created() {
    this.$store.dispatch("realTimeUpdateFiles");
    this.$store.dispatch("loadFiles");
    // this.$store.dispatch("realTimeUpdate");
  },
  methods: {
    refresh() {
      this.$store.dispatch("loadFiles");
    },
  },
};
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}

.user-list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.user-list-enter-active {
  transition: all 1s ease-out;
}
.user-list-enter-to, .user-list-leave-from {
  opacity: 1;
  transform: translateX(0px);
}
.user-list-leave-active {
  transition: all 0.8s ease-in;
  position: relative;
}
.user-list-leave-to{
    opacity: 0;
    transform: translateX(320px);
}
.user-list-move{
    transition: transform 0.4s ease;
}


</style>