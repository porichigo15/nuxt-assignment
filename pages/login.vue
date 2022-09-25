<template>
  <div class="content">
    <v-card :width="`${isMobile ? 80 : 50}%`">
      <v-card-text>
        <v-form v-model="valid">
          <v-container>
            <v-row>
              <v-col cols="12">
                <div class="center">
                  <v-img
                    :height="size"
                    :width="size"
                    :src="require(`~/assets/image/logo/logo_512.png`)"
                  ></v-img>
                </div>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.username"
                  :label="$t('email')"
                  :rules="rules.email"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="form.password"
                  :label="$t('password')"
                  :rules="rules.password"
                  type="password"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn
                  color="primary"
                  type="submit"
                  @click="login"
                  class="full-width"
                  >{{ $t("login-button") }}</v-btn
                >
              </v-col>
              <v-col cols="12">
                <v-btn
                  color="primary"
                  @click="register"
                  outlined
                  class="full-width"
                  >{{ $t("register-button") }}</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
    <Loading :loading="loading"/>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  data: () => ({
    size: 100,
    form: {
      username: "",
      password: "",
    },
    valid: false,
    loading: false,
    isMobile: false,
  }),
  mounted() {
    this.onResize();
    window.addEventListener("resize", this.onResize, { passive: true });
  },
  beforeDestroy() {
    if (typeof window === "undefined") return;
    window.removeEventListener("resize", this.onResize, { passive: true });
  },
  computed: {
    rules() {
      return {
        email: [
          (v) => !!v || this.$t("email-require"),
          (v) => /.+@.+/.test(v) || this.$t("email-not-valid"),
        ],
        password: [(v) => !!v || this.$t("password-require")],
      };
    },
  },
  methods: {
    onResize() {
      this.isMobile = window.innerWidth < 600;
    },
    async login(e) {
      const formData = new FormData();

      e.preventDefault();

      formData.append("username", this.form.username);
      formData.append("password", this.form.password);

      this.loading = true;

      this.$axios
        .post("/login", formData)
        .then((res) => {
          if (res) {
            this.$cookies.set("token", res.headers.token, {
              path: "/",
              maxAge: 60 * 30,
              sameSite: 'strict'
            });
            this.$router.push({
              path: "/",
            });
            this.loading = false;
          }
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
    register() {
      this.$router.push({
        path: "/register",
      });
    },
  },
};
</script>
