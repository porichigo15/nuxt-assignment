<template>
  <v-app>
    <Nuxt />
  </v-app>
</template>

<script>
export default {
  name: "DefaultLayout",
  data() {
    return {
      drawer: false,
      fixed: false,
      clipped: false,
      path: "/login",
      selected: "Activity",
      title: "ASC",
      items: [
        {
          icon: "mdi-apps",
          title: "Party",
          to: "/",
        },
      ],
    };
  },
  mounted() {
    const split = this.$route.path.split("/");
    this.path = this.$route.path;
    if (split[1] === "") {
      this.selected = "activity";
    } else {
      this.selected = split[1];
    }

    this.selected =
      this.selected.charAt(0).toUpperCase() + this.selected.slice(1);
  },
  updated() {
    this.path = this.$route.path;
  },
  methods: {
    goToHome() {
      this.$router.push({
        path: "/",
      });
    },
    logout() {
      this.$cookies.removeAll();
      this.$router.push({
        path: "/login",
      });
    },
  },
};
</script>
