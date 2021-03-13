<template>
    <div>
        <v-app-bar 
        flat
        app>
            <v-app-bar-nav-icon @click="drawer = !drawer" v-if="isAdmin"></v-app-bar-nav-icon>
            <v-app-bar-title>Nuxt-Basic-App</v-app-bar-title> 
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" app v-if="isAdmin">
        <v-list>
          <v-list-item link :to="'/backoffice/my-account'">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="text-truncate">
              <v-list-item-title>
                {{ $store.getters["auth/username"] }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>

        <v-list dense>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            :to="item.href"
            link
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="primary--text">
                {{ item.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click.prevent="signOut">
            <v-list-item-icon>
              <v-icon>mdi-logout-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="primary--text"
                >Sign out</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
        </v-navigation-drawer>
    </div> 
</template>

<script>
import { mapActions } from "vuex";

export default {
  props:["isAdmin"],
  data() {
    return {
      drawer: false,
      items: [
        { title: "Dashboard", href: "/backoffice/", icon: "mdi-view-dashboard" },
        {
          title: "Users",
          href: "/backoffice/user-list",
          icon: "mdi-account-multiple"
        },
        { title: "Client", href: "/", icon: "mdi-home" }
      ]
    };
  },
  
  methods: {
    ...mapActions({
      signOutAction: "auth/signOut"
    }),

    signOut() {
      this.signOutAction()
        .then(() => {
          this.$router.push("/sign-in");
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
}
</script>

<style>

</style>