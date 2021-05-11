<template>
  <div>
    <v-form>
      <v-card class="mx-auto my-12" elevation="15" outlined max-width="800">
        <v-row no-gutters>
          <v-col cols="12">
            <v-card-title>Change Password</v-card-title>
            <v-divider></v-divider>
          </v-col>
        </v-row>
        <v-card-text class="mt-7">
          <v-form v-model="validate">
            <v-row class="px-3">
              <v-text-field
                label="Old Password"
                v-model="oldPassword"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                name="input-10-1"
                counter
                :rules="[rules.required]"
                @click:append="show1 = !show1"
                outlined
                :disabled="isDisabled"
              ></v-text-field>
            </v-row>
            <v-row class="px-3">
              <v-text-field
                label="New Password"
                v-model="password"
                :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show2 ? 'text' : 'password'"
                name="input-10-1"
                counter
                :rules="[rules.required]"
                @click:append="show2 = !show2"
                outlined
                :error-messages="errorMessage"
                :disabled="isDisabled"
              ></v-text-field>
            </v-row>
            <v-row class="px-3">
              <v-text-field
                label="Confirm Password"
                v-model="confirmPassword"
                :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show3 ? 'text' : 'password'"
                name="input-10-1"
                counter
                :rules="[rules.required]"
                @click:append="show3 = !show3"
                outlined
                :error-messages="errorMessage"
                :disabled="isDisabled"
              ></v-text-field>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="ml-1">
          <v-spacer></v-spacer>
          <v-btn
            color="success pb-10"
            width="100%"
            outlined
            text
            :disabled="!validate"
            @click="changePassword"
          >
            Save
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
    show1: null,
    show2: null,
    show3: null,
    validate: null,
    oldPassword: "",
    password: "",
    confirmPassword: "",
    errorMessage: "",
    isDisabled: false,
  }),
  computed: {
    passwordsAreEqual() {
      return this.password == this.confirmPassword;
    },
  },
  watch: {
    passwordsAreEqual(val) {
      if (val) this.errorMessage = "";
      else this.errorMessage = "Passwords do not match.";
    },
  },
  methods: {
    changePassword() {
      let obj = {
        oldPassword: this.oldPassword,
        password: this.password,
      };
      this.$store
        .dispatch("changePassword", obj)
        .then((resp) => {
          if (resp.data.message) {
            this.$notify({
              group: "mainActionsNotifications",
              title: "Error!",
              text: "Incorrect information, please try again.",
              type: "error",
              duration: 5000,
            });
          } else {
            this.$notify({
              group: "mainActionsNotifications",
              title: "Success!",
              text: "Password has been changed successfully.",
              type: "success",
              duration: 5000,
            });
            this.validate = null;
            this.isDisabled = true;
            setTimeout(() => {
              this.$store.dispatch("signOutUser");
              this.$router.replace({ name: "Login" });
            }, 5000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
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
