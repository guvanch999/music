<template>
  <div
    style="position: fixed;z-index: 99999;width: 90%;left: 5%;color: white;top:10px;padding: 10px 12px;border-radius: 4px;"
    :style="{'background-color':color}">
    {{ message }}
  </div>
</template>
<script>
export default {
  props: {
    color: {
      type: String,
      default: "#fa3434"
    },
    message: {
      type: String,
      default: "Network error, please try again!"
    }
  },
  mounted() {
    let cnt = this
    setTimeout(() => {
      cnt.$emit("closeError")
    }, 1500)
  }
}
</script>
