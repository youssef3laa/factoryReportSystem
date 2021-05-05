  
<template>
  <v-app id="error">
    <v-container fluid fill-height>
      <v-layout align-center justify-center row>
        <div class="text-md-center">
          <h1 class="errorCode">{{ 404 }}</h1>
          <h2 class="my-3 headline justify-center">
            Looking for Something? We're sorry. The Web address you entered is
            not a functioning page on the site
          </h2>
          <div>
            <v-btn color="secondary" :to="{ name: 'Home' }">Go Home</v-btn>
          </div>
        </div>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {};
</script>

<style>
.d {
  margin: 0 auto;
  width: 25% !important;
}
.errorCode {
  text-align: center;
  vertical-align: middle;
  font-size: 170px;
  line-height: 170px;
  font-weight: 800;
  color: #424242;
  text-shadow: rgba(61, 61, 61, 0.3) 1px 1px, rgba(61, 61, 61, 0.2) 2px 2px,
    rgba(61, 61, 61, 0.3) 3px 3px;
}
</style>