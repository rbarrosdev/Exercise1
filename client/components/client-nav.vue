<template>
  <div>
    <v-app-bar 
    dense
    flat
    app>

    <v-app-bar-nav-icon 
    @click="drawer = !drawer"
    class="hidden-sm-and-up"
    ></v-app-bar-nav-icon>

    <v-app-bar-title class="ml-8">Nuxt-Basic-App</v-app-bar-title> 

    <template v-if="isClient">
      <v-spacer></v-spacer>
      <v-col cols="3" class="hidden-xs-only">
          <template v-if="!loggedIn">
            <v-btn link text x-small :to="'/client/register'"> 
            <v-icon left x-small>mdi-account-plus</v-icon> Register </v-btn>
            <v-btn link text x-small :to="'/sign-in'">
            <v-icon left x-small>mdi-login-variant</v-icon> Sign in </v-btn>
          </template>
          <template v-else>
            <v-btn 
            link 
            text 
            x-small 
            class="caption font-weight-bold text-capitalize"
            >
                <v-icon left x-small>mdi-account</v-icon>   
                {{ $store.getters["auth/username"] }} 
            </v-btn> 
            <v-btn link text x-small @click.prevent="signOut"> 
                <v-icon left x-small>mdi-logout-variant</v-icon> Sign out </v-btn>
          </template>
          
        </v-col>
    </template>

    <template v-slot:extension v-if="isClient">
        <v-tabs 
        centered
        >
            <v-tab :to="'/'">
                Home
            </v-tab>
            <v-tab :to="'/about'">
                About
            </v-tab>
            <v-tab :to="'/backoffice'" v-if="isAdminUser">
                BackOffice
            </v-tab>
        </v-tabs>
    </template>

    </v-app-bar>

    <v-navigation-drawer
    v-model="drawer"
    app
    v-if="isMobile"
    >
        <v-list v-if="loggedIn">
            <v-list-item link>
                <v-list-item-icon>
                    <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    {{ $store.getters["auth/username"] }}
                </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item link @click.prevent="signOut">
                <v-list-item-icon>
                    <v-icon>mdi-logout-variant</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    Sign out
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <v-list v-else>
            <v-list-item link :to="'/client/register'">
                <v-list-item-icon>
                    <v-icon>mdi-account-plus</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    Register
                </v-list-item-content>
            </v-list-item>
            <v-list-item link :to="'/sign-in'">
                <v-list-item-icon>
                    <v-icon>mdi-login-variant</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    Sign in
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>

  </div>
 
</template>

<script>
import { mapActions } from "vuex";

export default {
    props:["isClient"],

    data() {
        return {
            drawer:false
        }
    },

    computed: {
        loggedIn() {
            return this.$store.getters["auth/loggedIn"];
        },
        isMobile() {
            return this.$vuetify.breakpoint.name === "xs"
        },

        isAdminUser() {
            if (this.$store.state.auth.roles === null ) return false;
            
            return  this.$store.state.auth?.roles?.indexOf("role_admin") !== -1
        }
    },

    methods: {
        ...mapActions({
            signOutAction: "auth/signOut"
        }),

        signOut() {
            this.signOutAction()
            .then(() => {
            this.$router.push("/");
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