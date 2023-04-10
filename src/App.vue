<template>

  <div id="app">
    &nbsp;
    <!--
  <button @click="count++">
    Count is: {{ count }}
  </button>
    <Home></Home>
    -->
  </div>


</template>

<script>
import Home from './components/Test.vue';

export default {

  data() {
    return {
      count: 0
    }
  },

  name: 'app',
  components: {
    Home
  }
}
</script>