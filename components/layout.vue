<template>
  <v-app>
    <v-navigation-drawer
      v-if="path !== '/login'"
      v-model="drawer"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app v-if="path !== '/login'">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title @click="goToHome">
        <v-img
          :height="size"
          :width="size"
          :src="require(`~/assets/image/logo/logo_72.png`)"
        ></v-img>
      </v-toolbar-title>
      <v-spacer />
      <v-row class="end-content">
        <div class="select-content">
          <v-select
            v-model="selectLang"
            :style="`max-width: ${isMobile ? 100 : 200}px !important`"
            :items="languages"
            :label="$t('language')"
            @change="changeLanguage"
          ></v-select>
        </div>
        <v-menu left bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="item in menus"
              :key="item.title"
              @click="action(item)"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-row>
    </v-app-bar>
    <v-main>
      <v-container>
        <component :is="children">
          <slot />
        </component>
        <Loading :loading="loading" />
      </v-container>
    </v-main>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "Layout",
  props: {
    children: {
      type: [String, Object],
      default: "div",
    },
    loading: Boolean,
  },
  data() {
    return {
      drawer: false,
      fixed: false,
      clipped: false,
      isMobile: false,
      path: "/",
      title: null,
      size: 40,
      items: [],
      menus: [],
      selectLang: "en",
      languages: [
        {
          value: "en",
          text: "English",
        },

        {
          value: "th",
          text: "ไทย",
        },
      ],
    };
  },
  mounted() {
    this.path = this.$route.path;
    this.items = [
      {
        icon: "mdi-apps",
        title: this.$t("party"),
        to: "/",
      },
    ];
    this.menus = [{ title: this.$t("sign-out"), action: "logout" }];

    this.title = this.$t("app-name");

    this.selectLang = this.$cookies.get("selectLang");
    this.$i18n.locale = this.selectLang;

    this.onResize();
    window.addEventListener("resize", this.onResize, { passive: true });
  },
  updated() {
    this.path = this.$route.path;
  },
  beforeDestroy() {
    if (typeof window === "undefined") return;
    window.removeEventListener("resize", this.onResize, { passive: true });
  },
  methods: {
    goToHome() {
      this.$router.push({
        path: "/",
      });
    },
    action(item) {
      if (item.action === "logout") {
        this.logout();
      }
    },
    logout() {
      this.$cookies.remove("token");
      this.$router.push({
        path: "/login",
      });
    },
    changeLanguage(e) {
      this.$i18n.locale = e;
      this.$cookies.set("selectLang", e, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7
      });
    },
    onResize() {
      this.isMobile = window.innerWidth < 600;
    },
  },
};
</script>

<style scoped>
.end-content {
  display: grid;
  gap: 8px;
  grid-auto-flow: column;
  justify-content: end;
  align-items: center;
}

.select-content {
  margin-top: 20px;
}
</style>