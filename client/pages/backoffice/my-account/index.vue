<template>
  <div class="mx-auto "> 
    <v-row no-gutters justify="space-around" class="mt-4 mx-4">
      <v-col class="col-sm-6 col-xs-12">
        <v-card outlined >
          <v-card-subtitle>
            My account
          </v-card-subtitle>
          <v-card-text>
            <v-row no-gutters>
            <v-col>
              <v-text-field
              name="new-email"
              id="email"
              data-test="email"
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              :disabled="true"
                ></v-text-field>
            </v-col>
            </v-row>
            <v-row no-gutters class="mb-6"> 
              <v-col>
                <v-text-field
                name="fullname"
                id="fullname"
                data-test="fullname"
                v-model="fullname"
                label="Fullname"
                :disabled="true"
                  ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          
        </v-card>
      </v-col>
     </v-row>

     <v-row no-gutters justify="space-around" class="mt-4 mx-4">
       <v-col class="col-sm-6 col-xs-12">
          <h3 class="primary--text mt-6">Log in history</h3>
          <v-divider></v-divider>
       </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
    layout: "simple",
    middleware: "admin",
    data : () => ({
      email:"",
      fullname:"",
      emailRules:[]
    }),

    async created() {
      const userId = this.$store.state.auth.userId;
      let { data } = await this.$axios.get(`/api/users/${userId}`); 

      this.email = data.user.email;
      this.fullname = this.$store.getters["auth/username"]
    }
}
</script>

<style>

</style>