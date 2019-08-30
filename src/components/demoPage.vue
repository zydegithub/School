<template>
  <el-tabs type="border-card" v-model="activeName" style="height:100%;width:100%;overflow:auto">
    <el-tab-pane label="地图" name="first">
      <div ref="map" id="MapView" class="map"></div>
      <el-button title="拉框放大" @click="zoomIn(1204)" id="btn">放大</el-button>
    </el-tab-pane>
    <el-tab-pane label="列表" name="second" style="height:100%;width:100%;">
      <div style="height:83vh;width:100%;overflow:auto">
        <el-row>
          <el-col :span="24">
            <!-- 中间动态区 -->
            <div style="height:100%;width:79.6%;float:left;">
              <el-scrollbar style="height:100%;width:100%">
                <!-- 每个动态 -->
                <div
                  class="grid-content bg-purple-dark"
                  style="margin:0px 0px 10px 0px;width:100%;background:#F5F7FA"
                  v-for="(item,index) in search(keywords)"
                  :key="index"
                >
                  <!-- 动态个人信息 -->
                  <div>
                    <div style="float:left">
                      <img
                        style="width:54px;height:54px;border-radius:50%;margin:10px 20px 10px 24px;"
                        v-bind:src="'http://'+item.head"
                      />
                    </div>
                    <div style="float:left">
                      <a :name="mao(item.object_id)"></a>
                      <span
                        style="line-height:46px;font-size:18px;font-weight:600"
                      >{{ item.nickname }}</span>
                      <br />
                      <span
                        style="line-height:20px;font-size:12px;font-weight:400"
                      >{{ item.date | ellipsis2 }}</span>
                    </div>
                    <div
                      style="float:right;margin-top:10px;margin-right:10px"
                      v-if="info.name==item.user"
                    >
                      <a href="#" @click="delect(item.object_id)" title="删除">
                        <img
                          style="width:24px;vertical-align:middle"
                          src="image/theme/icon/delect2.png"
                        />
                      </a>
                    </div>
                  </div>

                  <!-- 动态内容区 -->
                  <div style="padding-left:24px;clear:both">
                    <p>{{ item.content }}</p>
                    <viewer :images="item.picture">
                      <!-- <img
                      v-for="src in item.picture"
                      class="preview-img"
                      width="200px"
                      height="120px"
                      style="margin-right:20px"
                      v-bind:src="src.url"
                      @click="$preview.open(item)"
                      :key="src.url"
                      >-->
                      <img
                        class="preview-img"
                        width="200px"
                        height="120px"
                        style="margin-right:20px"
                        v-bind:src="'http://'+item.picture"
                        @click="$preview.open(item)"
                      />
                    </viewer>
                  </div>

                  <div style="width:100%">
                    <div style="float:left;margin:0px 15px 10px 24px;">
                      <img
                        style="width:24px;vertical-align:middle"
                        src="image/theme/icon/location.png"
                        @click="location(item.object_id)"
                      />
                      <span style="font-size:14px">[地图位置]</span>
                    </div>

                    <!-- 评论点赞按钮 -->
                    <div style="float:right;margin:0px 15px 10px auto;">
                      <a href="#" @click="toggle(item.object_id)">
                        <img
                          style="width:24px;vertical-align:middle"
                          src="image/theme/icon/message.png"
                        />
                        <span
                          style="font-weight:200;margin-right:30px;margin-left:2px"
                        >{{ item.comments | nocomment }}</span>
                      </a>
                      <a
                        href="#"
                        @click="like(item.object_id)"
                        v-if="item.likes.indexOf(','+info.name+',')==-1"
                      >
                        <img
                          style="width:24px;vertical-align:middle"
                          src="image/theme/icon/like.png"
                        />
                        <span
                          style="font-weight:200;margin-right:20px;margin-left:2px"
                        >{{ item.likecount }}</span>
                      </a>
                      <a href="#" @click="like(item.object_id)" v-else>
                        <img
                          style="width:24px;vertical-align:middle"
                          src="image/theme/icon/liked.png"
                        />
                        <span
                          style="font-weight:200;margin-right:20px;margin-left:2px"
                        >{{ item.likecount }}</span>
                      </a>
                    </div>
                  </div>

                  <!-- 好友评论区 -->
                  <div
                    style="width:96%;height:100%;margin-bottom:5px;margin-left:24px"
                    v-if="item.play"
                  >
                    <hr style="width:100%" />
                    <div v-for="comments in item.comments" :key="comments.cid">
                      <div>
                        <div style="float:left">
                          <img
                            style="width:40px;height:40px;border-radius:50%;margin:2px 8px 2px 4px;"
                            v-bind:src="'http://'+comments.head"
                          />
                        </div>
                        <div style="float:left;margin:2px 8px 2px 6px;">
                          <span
                            style="line-height:20px;font-size:14px;font-weight:500"
                          >{{ comments.nickname }} : {{ comments.content }}</span>
                          <br />
                          <span
                            style="line-height:12px;font-size:8px;font-weight:400"
                          >{{ comments.date_c | ellipsis2 }}</span>
                          <a href="#" @click="commentReply(item.object_id,comments.id)">
                            <img
                              style="width:20px;vertical-align:middle;margin-left:10px"
                              src="image/theme/icon/message.png"
                            />
                          </a>
                        </div>
                        <div style="float:right;" v-if="info.name==comments.user_c">
                          <a href="#" @click="delect2(comments.id)" title="删除">
                            <img
                              style="width:20px;vertical-align:middle"
                              src="image/theme/icon/delect2.png"
                            />
                          </a>
                        </div>
                        <div style="float:left;margin-top:1px" v-if="comments.play">
                          <el-input v-model="comments.input" placeholder="回复:" style="width:860px"></el-input>
                          <el-button
                            @click="commentSent(item.object_id,comments.id,comments.nickname)"
                          >发送</el-button>
                        </div>
                      </div>

                      <!-- 好友回复区 -->
                      <div v-for="(reply,index) in find(item.object_id,comments.id)" :key="index">
                        <div
                          style="width:100%;height:100%;margin-bottom:5px;margin-left:24px;clear:both"
                        >
                          <div>
                            <div style="float:left">
                              <img
                                style="width:40px;height:40px;border-radius:50%;margin:2px 8px 2px 4px;"
                                v-bind:src="'http://'+reply.head"
                              />
                            </div>
                            <div style="float:left;margin:2px 8px 2px 6px;">
                              <span
                                style="line-height:20px;font-size:14px;font-weight:500"
                              >{{ reply.nickname }} 回复 {{ reply.nickname_c }} : {{ reply.content }}</span>
                              <br />
                              <span
                                style="line-height:12px;font-size:8px;font-weight:400"
                              >{{ reply.date_c | ellipsis2 }}</span>
                              <a href="#" @click="replyReply(reply.object_id,reply.id)">
                                <img
                                  style="width:20px;vertical-align:middle;margin-left:10px"
                                  src="image/theme/icon/message.png"
                                />
                              </a>
                            </div>
                            <div
                              style="float:right;margin-right:20px"
                              v-if="info.name==reply.user_c"
                            >
                              <a href="#" @click="delect3(reply.id)" title="删除">
                                <img
                                  style="width:20px;vertical-align:middle"
                                  src="image/theme/icon/delect2.png"
                                />
                              </a>
                            </div>
                            <div style="float:left;margin-top:1px" v-if="reply.play">
                              <el-input v-model="reply.input" placeholder="回复:" style="width:826px"></el-input>
                              <el-button
                                @click="replySent(item.object_id,reply.cid,reply.nickname)"
                              >发送</el-button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style="clear:both"></div>
                    </div>
                  </div>

                  <!-- 评论框 -->
                  <el-input v-model="item.input" placeholder="评论:" style="width:93%"></el-input>
                  <el-button style="width:7%" @click="sent(item.object_id)">发送</el-button>
                </div>
              </el-scrollbar>
            </div>

            <!-- 侧边栏 -->
            <div
              style="height:100%;width:19%;right:0;background:#F5F7FA;border-radius:5px;position:fixed"
            >
              <el-tag style="width:100%;height:46px;margin-bottom:4px">
                <span style="margin-left:12px;font-size:16px;font-weight:500;line-height:44px">热度排行</span>
                <img style="width:24px;vertical-align:middle" src="image/theme/icon/fire.png" />
              </el-tag>
              <div
                v-for="(item,index) in heat(keywords)"
                :key="index"
                style="width:100%;height:26px;margin-top:2px"
              >
                <div style="float:left">
                  <a
                    style="margin-left:16px;font-size:14px"
                    :href="mao2(item.object_id)"
                    title="查看"
                  >
                    <span>{{ item.content | ellipsis }}</span>
                  </a>
                </div>
                <div style="float:right">
                  <span
                    style="margin-right:16px;color:#808080;font-size:14px"
                  >{{ item.likes.split(",").length-2 }}</span>
                </div>
              </div>
              <el-tag style="width:100%;height:46px;">
                <span style="margin-left:12px;font-size:16px;font-weight:500;line-height:44px">附近</span>
                <img style="width:24px;vertical-align:middle" src="image/theme/icon/location2.png" />
              </el-tag>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Vue from 'vue';
import esriLoader from 'esri-loader';
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
import { mapState } from 'vuex';
Vue.use(Viewer)
Viewer.setDefaults({
  Options: {
    inline: true,
    button: true,
    navbar: true,
    title: true,
    toolbar: true,
    tooltip: true,
    movable: true,
    zoomable: true,
    rotatable: true,
    scalable: true,
    transition: true,
    fullscreen: true,
    keyboard: true,
    url: 'data-source'
  }
})
export default {
  name: '',

  components: {},

  props: {
    datestart: String,
    dateend: String,
    sign: String
  },
  data () {
    return {
      arcgis: {}, // gis 构造函数
      gisInst: {}, // gis 实例
      gisModules: [
        'esri/map',
        'esri/dijit/BasemapToggle',
        'esri/graphic',
        'esri/layers/GraphicsLayer',
        'esri/layers/ArcGISDynamicMapServiceLayer',
        'esri/layers/ArcGISTiledMapServiceLayer',
        'esri/layers/FeatureLayer',
        'esri/tasks/FindParameters',
        'esri/tasks/FindTask',
        'esri/tasks/query',
        'esri/tasks/QueryTask',
        'esri/tasks/GeometryService',
        'esri/tasks/LengthsParameters',
        'esri/tasks/AreasAndLengthsParameters',
        'esri/tasks/BufferParameters',
        'esri/symbols/SimpleLineSymbol',
        'esri/symbols/SimpleFillSymbol',
        'esri/symbols/PictureMarkerSymbol',
        'esri/geometry/Extent',
        'esri/geometry/Point',
        'esri/SpatialReference',
        'esri/symbols/Font',
        'esri/symbols/TextSymbol',
        'esri/tasks/RouteTask',
        'esri/tasks/FeatureSet',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/tasks/RouteParameters',
        'esri/toolbars/draw',
        'esri/toolbars/navigation',
        'esri/Color',
        'dojo/dom',
        'dojo/on',
        'dojo/domReady!'
      ],
      activeName: 'first',
      id: '',
      nickname: '',
      username: '',
      date: '',
      head: '',
      picture: '',
      content: '',
      input: '',
      keywords: '',
      list: [],
      // list: [
      //   {
      //     object_id: 1204,
      //     nickname: "张三",
      //     username: "1",
      //     date: "5月19日 13:33",
      //     head: "image/theme/head/01.jpg",
      //     picture: [
      //       { url: "image/theme/head/01.jpg" },
      //       { url: "image/theme/head/02.jpg" }
      //     ],
      //     content: "第一条新动态",
      //     likePeople: ",1,12,",
      //     input: "",
      //     play: false,
      //     comment: [
      //       {
      //         cid: 1,
      //         user_c: 1,
      //         nickname: "评论人一",
      //         date_c: "17:33",
      //         content: "第一条评论",
      //         head: "image/theme/head/01.jpg",
      //         play: false,
      //         input: ""
      //       }
      //     ],
      //     reply: [
      //       {
      //         id: 1, // 回复id
      //         object_id: 1204, // 动态id
      //         cid: 1, // 评论id
      //         nickname:"回复人一",
      //         user_d: 2,
      //         head: "image/theme/head/01.jpg",
      //         date_c: "16:03",
      //         content: "第一条回复",
      //         play: false,
      //         input: ""
      //       }
      //     ]
      //   }
      // ],
      reply: '',
      dynamicId: '',
      cid: '',
      replyName: '',
      head: '',
      date_c: '',
      content: '',
      ranking: [],
      chartShow: true,
      activeTabName: 'first',
      searchResutlShow: false,
      buildingID: '',
      queryname: '',
      officnum: 0,
      basenum: 0,
      MapId: true,
      buildingData: {},
      chatList: [],
      chatContent: ''
    }
  },
  filters: {
    ellipsis (value) {
      if (!value) return '';
      if (value.length > 10) {
        return value.slice(0, 10) + '...';
      }
      return value
    },
    ellipsis2 (value) {
      if (!value) return '';
      var dt = new Date()
      var y = dt.getFullYear()
      var m = (dt.getMonth() + 1).toString().padStart(2, '0')
      var d = dt
        .getDate()
        .toString()
        .padStart(2, '0')
      var date = y + '-' + m + '-' + d
      if (value.slice(0, 10) == date) {
        return '今天' + value.slice(10, 16)
      }
      return value.slice(5, 16)
    },
    nocomment (value) {
      console.log(value)
      if (value == null) {
        return 0
      } else {
        return value.length
      }
    }
  },
  computed: {
    ...mapState('d2admin/user', ['info'])
  },
  mounted () {
    this.addData()
    this.init()
  },
  methods: {
    init () {
      // 加载css;
      // esriLoader.loadCss(
      //   "http://localhost/arcgis_js_api/library/3.17/3.17/esri/css/esri.css"
      // );
      // 加载模块
      esriLoader
        .loadModules(this.gisModules, {
          url:
            'http://47.92.153.85:8080/arcgis_js_api/library/3.17/3.17/init.js'
        })
        .then(this.initConstructor)
        .then(this.initMap)
    },
    initConstructor (args) {
      for (let k in args) {
        let name = this.gisModules[k].split('/').pop()
        if (name === 'map') {
          this.arcgis['Map'] = args[k]
        } else if (name === 'graphic') {
          this.arcgis['Graphic'] = args[k]
        } else if (name === 'query') {
          this.arcgis['Query'] = args[k]
        } else if (name === 'draw') {
          this.arcgis['Draw'] = args[k]
        } else if (name === 'navigation') {
          this.arcgis['Navigation'] = args[k]
        } else {
          this.arcgis[name] = args[k]
        }
      }
    },
    initMap () {
      let map = new this.arcgis.Map('MapView', {
        logo: true,
        basemap: 'topo',
        center: [114.49766263, 36.5697041],
        zoom: 16
      }) // 创建地图实例
      map.spatialReference = new this.arcgis.SpatialReference(4326)
      this.gisInst.map = map // 绑定到组件，方便操作
      let urlStatic =
        'http://47.92.153.85:6080/arcgis/rest/services/school/school_buildings/MapServer';
      // 指定ArcServer地址End
      let layer = new this.arcgis.ArcGISDynamicMapServiceLayer(urlStatic)
      this.gisInst.map.addLayer(layer)
      this.gisInst.navToolbar = new this.arcgis.Navigation(this.gisInst.map)
    },
    addData () {
      this.$http
        .post(
          'http://47.92.153.85:8080/school_bs/dynamic/loadDynamic',
          {
            datestart: this.datestart,
            dateend: this.dateend,
            sign: this.sign
          },
          { emulateJSON: true }
        )
        .then(result => {
          if (result.body != '') {
            this.list = result.body
          }
        })
      this.$http
        .post(
          'http://47.92.153.85:8080/school_bs/dynamic/hottop',
          {
            datestart: this.datestart,
            dateend: this.dateend,
            sign: this.sign
          },
          { emulateJSON: true }
        )
        .then(result => {
          if (result.body != '') {
            this.ranking = result.body
          }
        })
    },
    location (id) {
      var _this = this
      var queryTask = new this.arcgis.QueryTask(
        'http://47.92.153.85:6080/arcgis/rest/services/school/school_buildings/MapServer/0'
      )
      var query = new this.arcgis.Query()
      query.where = 'objectid =' + id
      query.outSpatialReference = { wkid: 4326 }
      query.returnGeometry = true
      query.outFields = ['*']
      queryTask.execute(query, function (graphics) {
        if (graphics.features.length === 0) {
          _this.layer.msg('没找到结果')
        } else {
          // var hoverSymbol = _this.createFillSymbol(
          //   _this.createLineSymbol([255, 0, 0, 10], 3),
          //   [255, 0, 5, 0.2],
          //   1
          // );
          var hoverSymbol = _this.createPictureSymbol(
            'image/theme/icon/location.png'
          )
          _this.gisInst.graphic = graphics.features[0]
          // 赋予相应的符号
          _this.gisInst.graphic.setSymbol(hoverSymbol)
          // 将graphic添加到地图中，从而实现高亮效果
          _this.gisInst.map.graphics.clear()
          _this.gisInst.map.graphics.add(_this.gisInst.graphic)
          var point = _this.gisInst.graphic.geometry
          _this.gisInst.map.centerAt(point)
          _this.activeName = 'first';
        }
      })
    },
    zoomIn () {
      this.gisInst.navToolbar.activate(this.arcgis.Navigation.ZOOM_IN)
    },
    // 创建线状符号
    createLineSymbol (color, size) {
      return new this.arcgis.SimpleLineSymbol(
        this.arcgis.SimpleLineSymbol.STYLE_SOLID,
        new this.arcgis.Color(color),
        size
      )
    },
    // 创建填充符号
    createFillSymbol (lineSymbol, color, size) {
      return new this.arcgis.SimpleFillSymbol(
        this.arcgis.SimpleFillSymbol.STYLE_SOLID,
        lineSymbol,
        new this.arcgis.Color(color),
        size
      )
    },
    createPictureSymbol (url) {
      return new this.arcgis.PictureMarkerSymbol(url, 25, 25)
    },
    search (keywords) {
      var newList = []
      this.list.forEach(item => {
        if (item.nickname.indexOf(keywords) !== -1) {
          newList.push(item)
        }
      })
      return newList
    },
    find (dynamicId, commentId) {
      var newList = []
      this.list.forEach(item => {
        if (item.object_id == dynamicId) {
          item.reply.forEach(item2 => {
            if (item2.cid == commentId) {
              newList.push(item2)
              console.log(newList)
            }
          })
        }
      })
      return newList
    },
    heat (keywords) {
      var newList = []
      this.ranking.forEach(item => {
        if (item.content.indexOf(keywords) !== -1) {
          newList.push(item)
        }
      })
      return newList
    },
    toggle (id) {
      console.log(id)
      this.list.some((item, i) => {
        if (item.object_id === id) {
          item.play = !item.play // 取反
          return true
        }
      })
    },
    like (id) {
      var username = localStorage.getItem('username')
      this.list.some((item, i) => {
        if (item.object_id === id) {
          if (item.likes.indexOf(',' + username + ',') == -1) {
            this.$http
              .post(
                'http://47.92.153.85:8080/school_bs/dynamic/giveLike',
                {
                  object_id: id,
                  likes: username
                },
                { emulateJSON: true }
              )
              .then(result => {
                this.addData()
              })
            return true
          } else {
            this.$http
              .post(
                'http://47.92.153.85:8080/school_bs/dynamic/removeLike',
                {
                  object_id: id,
                  likes: username
                },
                { emulateJSON: true }
              )
              .then(result => {
                this.addData()
              })
            return true
          }
        }
      })
    },
    sent (id) {
      var username = localStorage.getItem('username')
      var dt = new Date()
      var y = dt.getFullYear()
      var m = (dt.getMonth() + 1).toString().padStart(2, '0')
      var d = dt
        .getDate()
        .toString()
        .padStart(2, '0')
      var h = dt
        .getHours()
        .toString()
        .padStart(2, '0')
      var n = dt
        .getMinutes()
        .toString()
        .padStart(2, '0')
      var t = dt
        .getSeconds()
        .toString()
        .padStart(2, '0')
      var date_c = y + '-' + m + '-' + d + ' ' + h + ':' + n + ':' + t
      this.list.some((item, i) => {
        if (item.input != '') {
          if (item.object_id == id) {
            this.$http
              .post(
                'http://47.92.153.85:8080/school_bs/comment/addComment',
                {
                  object_id: id,
                  user_d: item.user,
                  user_c: username,
                  content: item.input,
                  date_c: date_c
                },
                { emulateJSON: true }
              )
              .then(result => {
                this.addData()
              })
          }
        } else {
          alert('请输入内容！')
        }
      })
    },
    commentSent (id, cid, nick) {
      console.log(nick)
      var username = localStorage.getItem('username')
      var dt = new Date()
      var y = dt.getFullYear()
      var m = (dt.getMonth() + 1).toString().padStart(2, '0')
      var d = dt
        .getDate()
        .toString()
        .padStart(2, '0')
      var h = dt
        .getHours()
        .toString()
        .padStart(2, '0')
      var n = dt
        .getMinutes()
        .toString()
        .padStart(2, '0')
      var t = dt
        .getSeconds()
        .toString()
        .padStart(2, '0')
      var date_c = y + '-' + m + '-' + d + ' ' + h + ':' + n + ':' + t
      this.list.some((item, i) => {
        if (item.object_id == id) {
          item.comments.some((it, i) => {
            if (it.id == cid) {
              if (it.input != '') {
                this.$http
                  .post(
                    'http://47.92.153.85:8080/school_bs/comment/addComment',
                    {
                      object_id: id,
                      user_d: item.user,
                      user_c: username,
                      content: it.input,
                      date_c: date_c,
                      cid: cid,
                      nickname_c: nick
                    },
                    { emulateJSON: true }
                  )
                  .then(result => {
                    this.addData()
                  })
              }
            }
          })
        }
      })
    },
    replySent (id, cid, nick) {
      var username = localStorage.getItem('username')
      var dt = new Date()
      var y = dt.getFullYear()
      var m = (dt.getMonth() + 1).toString().padStart(2, '0')
      var d = dt
        .getDate()
        .toString()
        .padStart(2, '0')
      var h = dt
        .getHours()
        .toString()
        .padStart(2, '0')
      var n = dt
        .getMinutes()
        .toString()
        .padStart(2, '0')
      var t = dt
        .getSeconds()
        .toString()
        .padStart(2, '0')
      var date_c = y + '-' + m + '-' + d + ' ' + h + ':' + n + ':' + t
      this.list.some((item, i) => {
        if (item.object_id == id) {
          item.reply.some((it, i) => {
            if (it.cid == cid) {
              this.$http
                .post(
                  'http://47.92.153.85:8080/school_bs/comment/addComment',
                  {
                    object_id: id,
                    user_d: item.user,
                    user_c: username,
                    content: it.input,
                    date_c: date_c,
                    cid: cid,
                    nickname_c: nick
                  },
                  { emulateJSON: true }
                )
                .then(result => {
                  this.addData()
                })
            }
          })
        }
      })
    },
    commentReply (id, cId) {
      this.list.some((item, i) => {
        if (item.object_id == id) {
          item.comments.some((it, i) => {
            if (it.id == cId) {
              it.play = !it.play
              return true
            }
          })
        }
      })
    },
    replyReply (oId, rId) {
      this.list.some((item, i) => {
        if (item.object_id == oId) {
          item.reply.some((it, i) => {
            if (it.id == rId) {
              it.play = !it.play
              return true
            }
          })
        }
      })
    },
    delect (id) {
      this.$layer.confirm(
        '您是否要删除该动态？',
        {
          btn: ['删除', '取消'] // 按钮
        },
        function () {
          this.$http
            .post(
              'http://47.92.153.85:8080/school_bs/dynamic/delDynamic',
              {
                object_id: id
              },
              { emulateJSON: true }
            )
            .then(result => {
              if (result.body == true) {
                this.$layer.msg('已删除！')
                this.layer.closeAll()
                this.addData()
              }
            })
        },
        function () {
          this.layer.closeAll()
        }
      )
    },
    delect2 (id) {
      var _this = this
      this.$layer.confirm(
        '您是否要删除该评论？',
        {
          btn: ['删除', '取消'] // 按钮
        },
        function () {
          _this.decomment(id)
          _this.$layer.msg('已删除！')
          _this.$layer.closeAll()
          _this.addData()
        },
        function () {
          this.layer.closeAll()
        }
      )
    },
    delect3 (id) {
      var _this = this
      this.$layer.confirm(
        '您是否要删除该回复？',
        {
          btn: ['删除', '取消'] // 按钮
        },
        function () {
          _this.decomment(id)
          _this.$layer.msg('已删除！')
          _this.$layer.closeAll()
          _this.addData()
        },
        function () {
          this.layer.closeAll()
        }
      )
    },
    decomment (id) {
      this.$http
        .post(
          'http://47.92.153.85:8080/school_bs/comment/delComment',
          {
            id: id
          },
          { emulateJSON: true }
        )
        .then(result => {
          if (result.body == true) {
            this.$layer.msg('已删除！')
            this.layer.closeAll()
          }
        })
    },
    mao (key) {
      return 'mao' + key
    },
    mao2 (key) {
      return '#mao' + key
    }
  }
}
</script>
<style scoped>
@import url("http://47.92.153.85:8080/arcgis_js_api/library/3.17/3.17/esri/css/esri.css");
.map {
  width: 100%;
  height: 100vh;
}
.el-tabs__content {
  padding: 0, 0, 0, 0;
}
.el-row {
  height: 100%;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #f5f7fa;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.item {
  margin-top: 10px;
  margin-right: 40px;
}
.el-scrollbar__wrap {
  overflow-x: hidden;
}
#btn {
  position: absolute;
  z-index: 2;
  top: 20px;
  right: 20px;
}
</style>
