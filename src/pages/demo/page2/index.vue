<template>
  <demo-page :datestart="datestart" :dateend="dateend" :sign="sign"></demo-page>
</template>

<script>
import demoPage from '../../../components/demoPage';
export default {
  name: 'layerIdList',
  components: {
    demoPage
  },
  data () {
    return {
      datestart: '2019-05-01',
      dateend: '2019-06-27',
      sign: '创业'
    }
  },
  computed: {},
  mounted () {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
