<template lang="">
  <div class="dialogA" v-if="show" @click="$emit('switch')">
    <div class="dialog__contentA" @click.stop>
      <slot> </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomDialog',
  props: {
    show: {
      type: Boolean,
    },
  },
}
</script>

<style scoped>
.dialogA {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  justify-content: center;
  align-items: center;
  margin: auto;
  background-color: rgba(0, 0, 0, 0.5);
}

.dialog__contentA {
  margin: auto;
  min-height: 50px;
  background-color: #fff;
  padding: 15px;
  border-radius: 10px;
}
</style>
