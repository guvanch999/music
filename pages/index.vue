<template>
  <div style="width: 100%;height: 100vh;position: fixed">
    <div style="position: absolute;top:50%;left: 50%;transform: translate(-50%,-50%);width: 30%">
      <v-card width="100%" tile>
        <v-card-title>
          Welcome to admin part
        </v-card-title>
        <v-divider/>
        <v-card-text>
          <v-text-field v-model="email" dense outlined label="Email:"></v-text-field>
          <v-text-field v-model="password" type="password" dense outlined label="Password:"></v-text-field>
        </v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="loginHandler" outlined depressed style="background-color: #32BCA3;color: white">login</v-btn>
        </v-card-actions>
        <loading-component v-if="isLoading"/>
      </v-card>
      <error-component v-if="!!errorMessage" :message="errorMessage" @closeError="errorMessage = null"/>
    </div>
  </div>
</template>

<script>
import ErrorComponent from "../components/ErrorComponent";
import LoadingComponent from "../components/LoadingComponent";
import {mapActions} from "vuex";

export default {
  components: {LoadingComponent, ErrorComponent},
  layout: 'login',
  name: 'IndexPage',
  data() {
    return {
      email: null,
      password: null,
      isLoading: false,
      errorMessage: null
    }
  },
  methods: {
    ...mapActions({
      login: 'login'
    }),
    async loginHandler() {
      if (this.isLoading) return
      this.isLoading = true
      let success = await this.login({email: this.email, password: this.password})
      this.isLoading = false
      if (success) {
        await this.$router.push('/dashboard')
      } else {
        this.errorMessage = "Invalid credentials!"
      }
    }
  }
}
</script>
