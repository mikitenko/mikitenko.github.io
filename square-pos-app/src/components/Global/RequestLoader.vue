<template>
  <div class="scandi-lds-ring">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>
<script>
export default {
  name: "request-loader"
};
</script>
<style lang="scss" scoped>
.scandi-lds-ring {
  display: inline-block;
  position: absolute;
  width: 64px;
  height: 64px;
  z-index: 1;
  left: 50%;
  margin-left: -32px;
}
.scandi-lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 51px;
  height: 51px;
  margin: 6px;
  border: 6px solid #1fb6ff;
  border-radius: 50%;
  animation: scandi-lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #1fb6ff transparent transparent transparent;
}
.scandi-lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.scandi-lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.scandi-lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes scandi-lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
