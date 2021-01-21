<template>
  <div>
    <base-card>
    <confirm-delete :isdel="!!isDel" @confirm-del="delActions"></confirm-delete>
    <li>
      <h3>{{ title }}</h3>

      <div class="actions">
        <base-button>
          <a :href="fileUrl + '/to/page'" target="_blank" download
            >Download</a
          ></base-button
        >
        <base-button @click="confirmDel">Delete</base-button>
      </div>
    </li>
    </base-card>
  </div>
</template>


<script>
export default {
  props: ["id", "title", "fileUrl", "fileName"],
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
        this.$store.dispatch("deleteFile", {
          id: this.id,
          fileName: this.fileName,
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
  border: 1px solid #424242;
  border-radius: 12px;
  padding: 1rem;
}

h3 {
  font-size: 1.5rem;
}
a {
  text-decoration: none;
  color: aliceblue;
}
h3,
a {
  word-wrap: break-word;
  margin: 0.5rem 0;
}

div {
  margin: 0.5rem 0;
}

.actions {
  display: flex;
  justify-content: space-between;
}

/* .download{} */
</style>