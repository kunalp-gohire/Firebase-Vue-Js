<template>
  <div>
    
      <confirm-delete
        :isdel="!!isDel"
        @confirm-del="delActions"
      ></confirm-delete>
      <li>
        <h3>{{ title }}</h3>
        <a :href="link" target="_blank"
          ><h4>{{ link }}</h4></a
        >
        <div class="actions">
          <base-button @click="confirmDel">Delete</base-button>
        </div>
      </li>
   
  </div>
</template>


<script>
export default {
  props: ["id", "title", "link"],
  data() {
    return {
      isDel: false,
    };
  },

  methods: {
    confirmDel() {
      this.isDel = true;
    },
    delActions(flag) {
      if (flag === true) {
        this.$store.dispatch("deleteLink", {
          id: this.id,
        });
      }
      this.isDel = false;
    },
  },
};
</script>


<style scoped>
li {
  margin: 1rem 0;
  border: 1px solid #ff0000;
  border-radius: 12px;
  padding: 1rem;
}
a {
  color: #513fb8;
}
h3 {
  font-size: 1.5rem;
}

h3,
a {
  word-wrap: break-word;
  margin: 0.5rem 0;
}

/* div {
  margin: 0.5rem 0;
} */

.actions {
  display: flex;
  justify-content: flex-end;
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
  transition: all 1s ease-in;
  position: absolute;
}
.user-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.user-list-move {
  transition: transform 0.8s ease;
}
</style>