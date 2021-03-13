<template>
  <div class="mx-1 mb-12">
    <!-- <v-container class="mt-4 sm-2"> -->
      <v-row no-gutters class="mt-4 sm-2">
      <v-col sm="6" md="6" lg="5" class="mx-auto">
        <v-card outlined >
    
          <v-form
          ref="form"
          v-model="valid"
          data-test="form"
          lazy-validation
          >
            <v-row no-gutters>
              <v-col >
                <v-card-title>Sign in</v-card-title>
              </v-col>
            </v-row>
            <v-row no-gutters class="mx-3">
              <v-col class="my-0 py-0">
                <v-text-field 
                name="email"
                id="email"
                data-test="email"
                v-model="email"
                :rules="emailRules"
                label="Email"
                required
                autocomplete="email"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters class="mx-3">
              <v-col class="my-0 py-0">
                <v-text-field
                v-model="password"
                data-test="password"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.min]"
                :type="show ? 'text' : 'password'"
                name="password"
                label="Password"
                hint="At least 8 characters"
                counter
                @click:append="show = !show"
                @keyup.enter="signIn"
                :error-messages="errors"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters class="mx-3 my-8">
              <v-col>
                <v-card-actions>
                  <v-btn 
                  name="btnSignIn"
                  outlined 
                  color="success"
                  :disabled="!valid"
                  ref="btnSignIn"
                  data-test="btnSignIn"
                  @click.prevent="signIn"
                  >Sign in</v-btn>

                </v-card-actions>
              </v-col>
            </v-row>
          </v-form>
        </v-card> 
        </v-col>
      </v-row>
    <!-- </v-container> -->
    
  </div>
  
</template>

<script>
import { mapActions } from "vuex";

export default {
  layout:"simple",
  name: "signIn",
  middleware: ["guest","client-layout"],
  data: () => {
    return {
      title: "Sign in",
      valid: true,
      email: '',
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'Email must be valid'
      ],
      show: false,
      password: '',
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 7 || 'Min 7 characters',
        // emailMatch: () => (`The email and password you entered don't match`)
      },
      errors:""
    }
  },
  methods: {
    ...mapActions({
      signInAction: "auth/signIn"
    }),

    async signIn () {
      if(this.$refs.form.validate()){

          this.signInAction({ email: this.email, password: this.password })
          .then(()=>{
            
            if(this.$store.state.auth.roles.indexOf("role_admin") !== -1 ) {
              console.log("role_admin")
              this.$router.push("/backoffice")
            } else {
              this.$router.push("/")
            }
          })
          .catch(e => {
            this.errors = "Invalid email or password."
            setTimeout(()=>{
              this.errors = "";
              this.password = ""
              this.valid = true;
            }, 2000);
          })
      }
    },
  },  
}
</script>

<style>

</style>