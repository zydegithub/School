<template>
  <div id="div1">
    <iframe
      :src="current"
      frameborder="0"
      scrolling="yes"
      style="position: absolute;width:100%;height:100%"
    ></iframe>
  </div>
</template>
<script>
export default {
  data () {
    return {
      usename: '',
      current: 'http://47.92.153.85:8080/school/school_dynamic.html?user=' + this.usename
    }
  },
  beforeCreate () {
    this.usename = localStorage.getItem('username')
    console.log('usena222me', this.usename)
  }
}
</script>

<style>
#div1 {
  height: 100%;
}
</style>
