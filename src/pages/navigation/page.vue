<template>
  <div id="div1">
    <iframe
      :src="current"
      frameborder="0"
      scrolling="yes"
      style="position: absolute;height:100%;width:100%;"
    ></iframe>
  </div>
</template>
<script>
export default {
  name: 'iframe',
  data () {
    return {
      current: 'http://47.92.153.85:8080/test/1.html'
    }
  }
}
</script>

<style>
#div1 {
  height: 100%;
}
</style>
