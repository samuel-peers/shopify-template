<template>
  <div class="dashboard">
    <h1 class="dashboard__header">
      {{ state }}
    </h1>
    <div @click="toggleState()">
      {{ msg }}
    </div>
  </div>
</template>

<script>
import { Machine, interpret } from "xstate";

const initialState = "inactive";

const toggleMachine = Machine({
  initial: initialState,
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
      toggleService: null,
      state: initialState
    };
  },
  mounted() {
    const service = interpret(toggleMachine).start();
    this.toggleService = service;
    this.state = service.state.value;
  },
  methods: {
    toggleState() {
      this.state = this.toggleService.send("TOGGLE").value;
    }
  }
};
</script>

<style scoped>
.dashboard__header {
  margin: 20px 0;
}
</style>
