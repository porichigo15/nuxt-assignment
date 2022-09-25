<template>
  <Layout>
    <v-container>
      <v-card class="card-content">
        <v-card-title>
          <h2>
            {{
              !party.id ? $t("create-party-title") : $t("update-party-title")
            }}
          </h2>
        </v-card-title>
        <v-spacer />
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                :label="$t('name-label')"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.total"
                :label="$t('total-label')"
                type="number"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="grid-end">
          <v-btn color="primary" outlined @click="cancel">{{
            $t("cancel-button")
          }}</v-btn>
          <v-btn v-if="!party.id" color="primary" @click="create">{{
            $t("create-button")
          }}</v-btn>
          <v-btn v-else color="primary" @click="update">{{
            $t("update-button")
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </Layout>
</template>

<script>
import Layout from "../../../components/layout.vue";

export default {
  name: "CreateParty",
  components: {
    Layout,
  },
  data: () => ({
    party: {},
    form: {
      name: null,
      total: null,
    },
  }),
  mounted() {
    if (this.$route.params.id && Number(this.$route.params.id) > 0) {
      this.getById(this.$route.params.id);
    }
  },
  methods: {
    cancel() {
      this.$router.push({
        path: "/",
      });
    },
    async getById(id) {
      await this.$axios
        .get(`/party/${id}`)
        .then((res) => {
          this.party = res.data || {};
          this.party.total = Number(this.party.total);
          
          this.form = {
              name: this.party.name,
              total: this.party.total,
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    showModal(title, text, icon) {
      if (icon === "success") {
        this.$swal
          .fire({
            title: title,
            text: text,
            icon: icon,
          })
          .then((result) => {
            if (result) {
              this.form = {
                name: null,
                total: null,
              };
              this.cancel();
            }
          });
      } else {
        this.$swal.fire({
          title: title,
          text: text,
          icon: icon,
        });
      }
    },
    async update() {
      const id = this.party.id;
      this.$axios
        .put(`/party/${id}`, this.form)
        .then(() => {
          this.showModal(
            this.$t("success"),
            this.$t("update-success"),
            "success"
          );
        })
        .catch((error) => {
          console.log(error);
          this.showModal("Error", JSON.stringify(error), "error");
        });
    },
    async create() {
      this.$axios
        .post("/party", this.form)
        .then(() => {
          this.showModal(
            this.$t("success"),
            this.$t("create-success"),
            "success"
          );
        })
        .catch((error) => {
          console.log(error);
          this.showModal("Error", JSON.stringify(error), "error");
        });
    },
  },
};
</script>

<style scoped>
.grid-end {
  display: grid;
  justify-content: end;
  grid-auto-flow: column;
}
.card-content {
  padding: 16px;
}
</style>