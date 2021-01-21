<template>
  <div>
   
    <base-card>
      <div class="controls">
        <base-button mode="outline" @click="load"> Refresh </base-button>
        <base-button link to="/add">Add Link</base-button>
      </div>
       <!-- <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div> -->
      <ul v-if="hasLinks">
        <transition-group tag="ul" name="user-list">
          <link-item
            v-for="link in links"
            :key="link.id"
            :id="link.id"
            :title="link.title"
            :link="link.link"
          >
          </link-item>
        </transition-group>
      </ul>
      <div v-else><h2>No links added</h2></div>
    </base-card>
  </div>
</template>

<script>
import LinkItem from "../components/Links/ListItem.vue";
export default {
  components: { LinkItem },
  data() {
    return {
      isLoading: true,
    };
  },
  created(){
    this.$store.dispatch("realTimeUpdate");
    
  },
 
  computed: {
    links() {
      const links = this.$store.getters.links;
      return links;
    },
    hasLinks() {
      return this.$store.getters.hasLinks;
    },
  },
  methods: {
    async load() {
      this.isLoading=true;
      await this.$store.dispatch("loadlinks");
      this.isLoading = false;
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
.user-list-enter-to,
.user-list-leave-from {
  opacity: 1;
  transform: translateX(0px);
}
.user-list-leave-active {
  transition: all 0.7s ease-in;
  position: relative;
}
.user-list-leave-to {
  opacity: 0;
  transform: translateX(320px);
}
.user-list-move {
  transition: transform 1s ease;
}
</style>