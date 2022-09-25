<template>
  <Layout :loading="loading">
    <v-row>
      <v-col class="end-grid">
        <v-btn color="primary" @click="create">{{
          $t("create-party-button")
        }}</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="party in parties" :key="party.id" :cols="isMobile ? 12 : 4">
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="12" class="no-padding">
                <v-img
                  height="300"
                  :src="require(`~/assets/image/${party.image}.jpg`)"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-col>
              <v-col cols="12" class="name"
                ><span>{{ party.name }}</span></v-col
              >
              <v-col cols="12"><v-divider /></v-col>
              <v-col cols="12">
                <v-row>
                  <v-col cols="6">
                    <strong
                      ><label
                        >{{ party.member || 0 }} / {{ party.total }}</label
                      ></strong
                    >
                  </v-col>
                  <v-col cols="6" class="full-width end-grid">
                    <v-row align="center">
                      <v-btn
                        v-if="!party.isJoin"
                        :disabled="party.disabled"
                        color="primary"
                        @click="join(party)"
                        >{{ $t("join-button") }}</v-btn
                      >
                      <v-btn
                        v-else
                        color="primary"
                        outlined
                        @click="unJoin(party)"
                        >{{ $t("un-join-button") }}</v-btn
                      >
                      <div @click="remove(party)" class="icon-button">
                        <v-icon :disabled="party.disabled">mdi-delete</v-icon>
                      </div>
                      <div @click="edit(party)" class="icon-button">
                        <v-icon>mdi-pencil</v-icon>
                      </div>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </Layout>
</template>

<script>
import Layout from "../components/layout.vue";

export default {
  name: "IndexPage",
  components: {
    Layout,
  },
  data: () => ({
    parties: [],
    loading: false,
    isMobile: false,
  }),
  mounted() {
    this.getParties();

    this.onResize();
    window.addEventListener("resize", this.onResize, { passive: true });
  },
  beforeDestroy() {
    if (typeof window === "undefined") return;
    window.removeEventListener("resize", this.onResize, { passive: true });
  },
  computed: {
    random() {
      const number = Math.floor(Math.random() * 10);
      return Math.max(number, 0);
    },
  },
  methods: {
    onResize() {
      this.isMobile = window.innerWidth < 600;
    },
    create() {
      this.$router.push({
        path: `/create-party/0`,
      });
    },
    remove(party) {
      if (!party.disabled) {
        this.$swal
          .fire({
            title: this.$t("confirm-to-remove-title"),
            text: this.$t("confirm-to-remove-message"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Save",
          })
          .then((result) => {
            if (result.isConfirmed) {
              this.delete(party.id);
            }
          });
      }
    },
    edit(party) {
      this.$router.push({
        path: `/create-party/${party.id}`,
      });
    },
    async delete(id) {
      await this.$axios
        .delete(`/party/${id}`)
        .then(() => {
          this.showModal(
            this.$t("success"),
            this.$t("delete-success"),
            "success"
          );
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getParties() {
      this.loading = true;
      const parties = await this.$axios
        .get("/party/find-parties")
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
        
      this.loading = false;
      if (parties) {
        this.parties = parties["data"];
        let count = 0;
        this.parties.forEach((item) => {
          count++;
          if (count > 10) {
            count = 1;
          }
          item.image = count;
        });
      } else {
        this.$router.push({
          path: "/login",
        });
      }
    },
    async join(party) {
      await this.$axios
        .post(`/party/join`, party)
        .then(() => {
          this.getParties();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async unJoin(party) {
      this.$swal
        .fire({
          title: this.$t("confirm-to-un-join-title"),
          text: this.$t("confirm-to-un-join-message"),
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Save",
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            await this.$axios
              .post(`/party/un-join`, party)
              .then(() => {
                this.getParties();
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
    },
    showModal(title, text, icon) {
      this.$swal
        .fire({
          title: title,
          text: text,
          icon: icon,
        })
        .then((result) => {
          if (result) {
            this.getParties();
          }
        });
    },
  },
};
</script>

<style scoped>
.end-grid {
  display: grid;
  justify-content: end;
}
.full-width {
  display: "grid";
}

.no-padding {
  padding: 0;
}

.icon-button {
  margin: 8px;
  cursor: pointer;
}
</style>