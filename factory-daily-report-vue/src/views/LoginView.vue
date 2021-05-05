<template>
  <div>
    <v-form @submit.prevent="login">
      <v-card
        :loading="loading"
        class="mx-auto my-12"
        elevation="15"
        outlined
        max-width="500"
        @keyup.enter="login"
      >
        <template slot="progress">
          <v-progress-linear
            color="primary"
            height="10"
            indeterminate
          ></v-progress-linear>
        </template>

        <v-img class="mx-5" src="../assets/logo@2x.png"></v-img>
        <h1
          class="text-center font"
          :style="{
            color: '#124f90',
            fontSize: '3em',
            marginTop: '-10px',
            marginBottom: '10px',
          }"
        >
          Report System
        </h1>
        <v-row no-gutters>
          <v-col cols="3">
            <v-card-title>Login</v-card-title>
          </v-col>
          <v-col class="mt-2 red--text">
            <v-card-text v-if="showErrorMsg">{{ errorMessage }} </v-card-text>
          </v-col>
        </v-row>
        <v-card-text @keyup.enter="login">
          <v-form>
            <v-row align="center" class="mx-0 mb-2">
              <div class="grey--text">
                Don't have an account? Ask the Mechanical Department
              </div>
            </v-row>
            <v-row class="px-3">
              <v-text-field
                v-model="email"
                :rules="[rules.required]"
                label="E-mail"
                outlined
              ></v-text-field>
            </v-row>
            <v-row class="px-3">
              <v-text-field
                label="Password"
                v-model="password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                name="input-10-1"
                counter
                :rules="[rules.required]"
                @click:append="show1 = !show1"
                outlined
              ></v-text-field>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="ml-1">
          <v-spacer></v-spacer>
          <v-btn
            color="success  pb-10"
            width="100%"
            outlined
            text
            @click="login"
          >
            Login
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>
<script>
import * as rules from "../utils/vrules";
export default {
  data: () => ({
    rules,
    show1: false,
    loading: false,
    email: "",
    password: "",
    showErrorMsg: false,
    errorMessage: "E-mail or Password is incorrect!",
  }),
  methods: {
    async login() {
      this.loading = true;
      let response = await this.$store.dispatch("login", {
        email: this.email.toLowerCase().trim(),
        password: this.password,
      });

      this.loading = false;
      if (response) this.$router.replace({ name: "Home" });
      else this.showErrorMsg = true;
    },
  },
};
</script>

<style scoped>
.font {
  font-family: Arial, sans-serif;
  font-weight: 700;
}
</style>
