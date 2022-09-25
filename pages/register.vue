<template>
  <div class="content">
    <v-card :width="`${isMobile ? 80 : 50}%`">
      <v-card-text>
        <v-form v-model="valid" ref="form">
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
                  v-model="form.email"
                  :label="$t('email')"
                  :rules="rules.email"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="form.password"
                  :label="$t('password')"
                  type="password"
                  :rules="rules.password"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="form.confirmPassword"
                  :label="$t('confirm-password')"
                  type="password"
                  :rules="rules.confirmPassword"
                  required
                ></v-text-field>
                <v-checkbox
                  v-model="form.accept"
                  :label="$t('term-and-condition')"
                ></v-checkbox>
              </v-col>
              <v-col cols="12">
                <v-btn
                  :disabled="disable"
                  color="primary"
                  @click="register"
                  class="full-width"
                  style="margin-bottom: 8px"
                  >{{ $t("register-button") }}</v-btn
                >
                <v-col align="center">
                  <NuxtLink to="/login">{{ $t("have-account") }}</NuxtLink>
                </v-col>
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
  name: "RegisterPage",
  data: () => ({
    size: 100,
    form: {
      email: "",
      password: "",
      confirmPassword: "",
      accept: false,
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
        password: [
          (v) => !!v || this.$t("password-require"),
          (v) => v && v.length > 6 || this.$t("min-password"),
          (v) => /[a-z]/.test(v) || this.$t("at-least-lower-character"),
          (v) => /[A-Z]/.test(v) || this.$t("at-least-upper-character"),
          (v) => /[#?!@$%^&*-]/.test(v) || this.$t("at-least-special-character"),
          ],
        confirmPassword: [
          (v) => !!v || this.$t("confirm-password-require"),
          (v) => v === this.form.password || this.$t("incorrect-password"),
        ],
      };
    },
    disable() {
      return !this.form.accept
    }
  },
  methods: {
    onResize() {
      this.isMobile = window.innerWidth < 600;
    },
    showModal(title, text, icon) {
      this.$swal
        .fire({
          title: title,
          text: text,
          icon: icon,
        })
        .then((result) => {
          if ((result, icon === "success")) {
            this.$refs.form.reset();
            this.goToLogin();
          }
        });
    },
    goToLogin() {
      this.$router.push({
        path: "/login",
      });
    },
    async register(e) {
      e.preventDefault();
      this.$refs.form.validate();
      if (!this.disable && this.valid) {
        this.loading = true;
        this.$axios
          .post("/register", this.form)
          .then((res) => {
            if (res) {
              this.loading = false;
              if (res.data.message === "USER_EXIST") {
                this.showModal(
                  this.$t("user-exist-title"),
                  this.$t("user-exist-text"),
                  "warning"
                );
              } else {
                this.showModal(
                  this.$t("register-success"),
                  this.$t("register-success-text"),
                  "success"
                );
              }
            }
          })
          .catch((error) => {
            console.log(error);
            this.loading = false;
          });
      }
    },
  },
};
</script>
