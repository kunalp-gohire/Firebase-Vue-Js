<template>
  <div>
    <the-header></the-header>
    <!-- <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div> -->
    <base-dialog :show="!!error" title="Error Occured!" @close="hasError">
      <p>{{ error }}</p>
    </base-dialog>
    <router-view v-slot="slotProps">
      <transition name="route" mode="out-in">
        
        <component :is="slotProps.Component"></component>
       
      </transition>
    </router-view>
    
  </div>
</template>


<script>
import TheHeader from "./components/layout/TheHeader.vue";
export default {
  components: { TheHeader },
  data() {
    return {
      isLoading: true,
      error: null,
    };
  },
  computed: {
    checkAuth() {
      return this.$store.getters.isAuthenticated;
    },
  },
  created(){
    this.$store.dispatch('tryLogin');
  },
  methods: {
     async loadLinks() {
      this.isLoading = true;
      if (this.checkAuth === true) {
        try {
          await this.$store.dispatch("loadlinks");
        } catch (error) {
          this.error = error.message || "Something went wrong!";
        }
      }
      this.isLoading = false;
    },
    hasError() {
      this.error = null;
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=PT+Sans&display=swap");

* {
  box-sizing: border-box;
}

html {
  font-family: "PT Sans", sans-serif;
}

body {
  margin: 0;
}

.route-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}
.route-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.route-enter-active {
  transition: all 0.3s ease-out;
}
.route-leave-active {
  transition: all 0.3s ease-in;
}
.route-enter-to,
.route-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>