<template>
  <v-app>
    <v-snackbar
      :timeout="$store.state.snackbar.timeOut"
      v-model="$store.state.snackbar.show"
      color="success"
      top
      outlined
      elevation="24"
    >
      {{ $store.state.snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="warning accent-4"
          text
          small
          v-bind="attrs"
          @click="closeSnackbar"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <template v-if="isClient" >
      <client-nav isClient="true"></client-nav>
    </template>
    <template v-else>
      <admin-nav isAdmin="true"></admin-nav>
    </template>

    <v-main>
      <nuxt/>
    </v-main>

    <v-footer absolute app class="mt-4">
      &copy: {{ new Date().getFullYear()}} - &nbsp; <strong>Nuxt-Basic-App</strong>
      &nbsp;&nbsp;
      <div class="no-gutters hidden-sm-and-up">
        breakpoint : Mobile
      </div>
      <div class="no-gutters hidden-md-and-up hidden-xs-only">
        breakpoint : Small
      </div>
      <div class="no-gutters hidden-lg-and-up hidden-sm-and-down">
        breakpoint : Medium
      </div>
      <div class="no-gutters hidden-xl-and-up hidden-md-and-down">
        breakpoint : Large
      </div>
      
    </v-footer>
  </v-app>
</template>

<script>
import clientNav from "../components/client-nav"
import adminNav from "../components/admin-nav"

export default {
  components: { adminNav },
  components:{clientNav, adminNav},
  data() {
    return {
      snackbar: true
    }
  },

  computed:{
    isClient() {
      return this.$store.state.auth.layout === "client";
    },

  },

  methods: {
    closeSnackbar() {
      this.$store.dispatch("updatSnackBarAction", {
        show: false,
        timeOut: 2000,
        text: ""
      })
    }
  }
}
</script>

