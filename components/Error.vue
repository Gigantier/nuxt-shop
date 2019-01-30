<template>
  <div v-if="visible" id="bg" @click="hide">
    <p id="error">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'Error',
  props: {
    message: {
      type: String,
      required: false,
      default: null
    },
    visible: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    hide() {
      this.$nuxt.$emit('dimissError');
    }
  }
};
</script>
