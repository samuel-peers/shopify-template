<template>
  <div class="dashboard">
    <h1 class="dashboard__header">
      {{ toggleService.state.value }}
    </h1>
    <div @click="toggleState()">
      {{ msg }}
    </div>
  </div>
</template>

<script>
import { Machine, interpret } from "xstate";

const toggleMachine = Machine({
  initial: "inactive",
  states: {
    inactive: { on: { TOGGLE: "active" } },
    active: { on: { TOGGLE: "inactive" } }
  }
});

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
      toggleService: null
    };
  },
  mounted() {
    this.toggleService = interpret(toggleMachine).start();
  },
  methods: {
    toggleState() {
      this.toggleService.send("TOGGLE");
    }
  }
};
</script>

<style scoped>
.dashboard__header {
  margin: 20px 0;
}
</style>
