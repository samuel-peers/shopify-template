<template>
  <div class="dashboard">
    <h1 :title="computed_count" class="dashboard__header">
      {{ computed_count }}
    </h1>
    <div @click="increment()">{{ msg }}</div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  props: {
    msg: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      count: 0
    };
  },
  computed: {
    computed_count: {
      get() {
        return this.count;
      },
      set(newValue) {
        this.count = newValue;
      }
    }
  },
  methods: {
    increment() {
      this.count = this.count + 1;
    }
  }
};
</script>

<style scoped>
.dashboard__header {
  margin: 20px 0;
}
</style>
