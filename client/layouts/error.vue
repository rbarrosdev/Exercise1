<template>
  <div class="mt-4 mx-aut col-6">
    <v-row no-gutters  justify="space-around">
      <v-col cols="6">
        <h1 v-if="error.statusCode === 404">Page not found</h1>
        <h1 v-else>Ops! Something went wrong</h1>
        <p class="mt-8">
        {{error.message}}
        </p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    props: ['error'],
    layout: "simple"
  }
</script>
