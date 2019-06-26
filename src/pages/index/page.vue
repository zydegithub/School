<template>
  <div class="wrapper">
    <div ref="map" id="MapView" class="map" v-show="mapshow">
      <el-button class="btn" @click="change()">影像图</el-button>
      <el-button class="add" icon="el-icon-plus" @click="add" circle></el-button>
      <el-button class="qq" icon="el-icon-mobile-phone" circle></el-button>
      <el-card class="box-card" id="content" v-if="show">
        <div slot="header" class="clearfix">
          <span>动态内容</span>
          <img
            style="float: right;top:0px;width:18px;"
            src="image/theme/icon/delect.png"
            @click="close"
          >
        </div>
        <div v-for="(item,index) in search(keywords)" :key="index">
          <div style="float:left">
            <img
              style="width:34px;height:34px;border-radius:50%;margin:2px 10px 2px 2px;"
              v-bind:src="item.head"
            >
          </div>
          <div style="float:left">
            <span style="line-height:20px;font-size:16px;font-weight:600">{{ item.nickname }}</span>
            <br>
            <span style="line-height:16px;font-size:10px;font-weight:400">{{ item.date }}</span>
          </div>
          <div style="padding-left:24px;clear:both">
            <p>{{ item.content }}</p>
            <viewer :images="item.picture">
              <img
                v-for="src in item.picture"
                class="preview-img"
                width="120px"
                height="80px"
                style="margin-right:20px"
                v-bind:src="src.url"
                @click="$preview.open(item)"
                :key="src.url"
              >
            </viewer>
          </div>
        </div>
      </el-card>
    </div>
    <div ref="map" id="MapView2" class="map" v-show="!mapshow">
      <el-button class="btn" @click="change()">矢量图</el-button>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
import esriLoader from "esri-loader";
export default {
  name: "",

  components: {},

  props: {},
  data() {
    return {
      arcgis: {}, // gis 构造函数
      gisInst: {}, // gis 实例
      gisModules: [
        "esri/map",
        "esri/graphic",
        "esri/layers/GraphicsLayer",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/ArcGISTiledMapServiceLayer",
        "esri/layers/FeatureLayer",
        "esri/tasks/FindParameters",
        "esri/tasks/FindTask",
        "esri/tasks/query",
        "esri/tasks/QueryTask",
        "esri/tasks/GeometryService",
        "esri/tasks/LengthsParameters",
        "esri/tasks/BufferParameters",
        "esri/tasks/AreasAndLengthsParameters",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/geometry/Extent",
        "esri/SpatialReference",
        "esri/symbols/Font",
        "esri/symbols/TextSymbol",
        "esri/tasks/RouteTask",
        "esri/tasks/FeatureSet",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/tasks/RouteParameters",
        "esri/toolbars/draw",
        "esri/toolbars/navigation",
        "esri/dijit/editing/Add",
        "esri/dijit/InfoWindow",
        "esri/Color",
        "dojo/dom",
        "dojo/on",
        "dojo/domReady!"
      ],
      chartShow: true,
      activeTabName: "first",
      searchResutlShow: false,
      buildingID: "",
      queryname: "",
      officnum: 0,
      basenum: 0,
      MapId: true,
      buildingData: {},
      chatList: [],
      chatContent: "",
      mapshow: true,
      show: false,
      id: "",
      nickname: "",
      username: "",
      date: "",
      head: "",
      picture: "",
      content: "",
      input: "",
      keywords: "",
      list: [
        {
          id: 1204,
          nickname: "张三",
          username: "1",
          date: "5月19日 13:33",
          head: "image/theme/head/01.jpg",
          picture: [
            { url: "image/theme/head/01.jpg" },
            { url: "image/theme/head/02.jpg" }
          ],
          content: "第一条新动态",
          likePeople: ",1,12,",
          input: "",
          play: false,
          comment: [
            {
              cid: 1,
              commentUsername: 1,
              commentName: "评论人一",
              commentDate: "17:33",
              commentContent: "第一条评论",
              commentHead: "image/theme/head/01.jpg",
              commentPlay: false,
              input: ""
            },
            {
              cid: 2,
              commentUsername: 2,
              commentName: "评论人二",
              commentDate: "17:37",
              commentContent: "第二条评论",
              commentHead: "image/theme/head/02.jpg",
              commentPlay: false,
              input: ""
            }
          ]
        }
      ]
    };
  },
  mounted() {
    this.init();
    this.init2();
  },
  methods: {
    init() {
      // 加载css;
      esriLoader.loadCss(
        "http://47.92.153.85:8080/arcgis_js_api/library/3.17/3.17/esri/css/esri.css"
      );
      // 加载模块
      esriLoader
        .loadModules(this.gisModules, {
          url:
            "http://47.92.153.85:8080/arcgis_js_api/library/3.17/3.17/init.js"
        })
        .then(this.initConstructor)
        .then(this.initMap);
    },
    init2() {
      // 加载css;
      esriLoader.loadCss(
        "http://47.92.153.85:8080/arcgis_js_api/library/3.17/3.17/esri/css/esri.css"
      );
      // 加载模块
      esriLoader
        .loadModules(this.gisModules, {
          url:
            "http://47.92.153.85:8080/arcgis_js_api/library/3.17/3.17/init.js"
        })
        .then(this.initConstructor)
        .then(this.initMap2);
    },
    initConstructor(args) {
      for (let k in args) {
        let name = this.gisModules[k].split("/").pop();
        if (name === "map") {
          this.arcgis["Map"] = args[k];
        } else if (name === "graphic") {
          this.arcgis["Graphic"] = args[k];
        } else if (name === "query") {
          this.arcgis["Query"] = args[k];
        } else if (name === "draw") {
          this.arcgis["Draw"] = args[k];
        } else if (name === "navigation") {
          this.arcgis["Navigation"] = args[k];
        } else {
          this.arcgis[name] = args[k];
        }
      }
    },
    initMap() {
      let map = new this.arcgis.Map("MapView", {
        logo: true,
        basemap: "topo",
        center: [114.49766263, 36.5697041],
        zoom: 16
      }); // 创建地图实例
      map.spatialReference = new this.arcgis.SpatialReference(4326);
      this.gisInst.map = map; // 绑定到组件，方便操作
      let urlStatic =
        "http://47.92.153.85:6080/arcgis/rest/services/school/school_buildings/MapServer/0";
      // 指定ArcServer地址End
      let layer = new this.arcgis.FeatureLayer(urlStatic);
      this.gisInst.map.addLayer(layer);
      map.on("click", e => {
        var params = new this.arcgis.BufferParameters();
        params.geometries = [e.mapPoint];
        params.distances = [0.05];
        params.unit = this.arcgis.GeometryService.UNIT_KILOMETER;
        params.bufferSpatialReference = new this.arcgis.SpatialReference({
          wkid: 32662
        });
        params.outSpatialReference = new this.arcgis.SpatialReference({
          wkid: 4326
        });
        var gsvc = new this.arcgis.GeometryService(
          "http://47.92.153.85:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer"
        );
        gsvc.buffer(params, this.showBuffer);
      });
      this.gisInst.toolbars = new this.arcgis.Draw(this.gisInst.map, {
        showTooltips: true
      });
      var hoverSymbol = this.createMarkerSymbol(
        this.createLineSymbol([140, 220, 218, 1], 3),
        2,
        [33, 255, 5, 0.2]
      );
      this.gisInst.toolbars.on("draw-complete", e => {
        var graphic = new this.arcgis.Graphic(e.geometry, hoverSymbol, {
          OBJECTID: 12
        });
        this.gisInst.map.graphics.clear();
        this.gisInst.map.graphics.add(graphic);
        let aaa = [graphic];
        console.log(aaa);
        var add = new this.arcgis.Add({
          featureLayer: layer, //给哪一个要素图层添加要素
          addedGraphics: [graphic]//用于添加的要素
        });
        add.performRedo();
        this.gisInst.map.addLayer(layer);
        this.gisInst.toolbars.deactivate(); // 画完一次销毁一下 lzl 20181119 注（注释说明不准确可修改）
      });
      this.gisInst.navToolbar = new this.arcgis.Navigation(this.gisInst.map);
    },
    showBuffer(features) {
      var hoverSymbol = this.createFillSymbol(
        this.createLineSymbol([255, 0, 0, 10], 3),
        [255, 0, 5, 0.2],
        1
      );
      var layerurl =
        "http://47.92.153.85:6080/arcgis/rest/services/school/school_buildings/MapServer/0";
      var queryTask = new this.arcgis.QueryTask(layerurl);
      //创建查询过滤器
      var query = new this.arcgis.Query();
      query.returnGeometry = true;
      query.outFields = ["*"]; //全部属性
      query.geometry = features[0];
      queryTask.execute(query, this.addPointsToMap);
    },
    // 创建线状符号
    createLineSymbol(color, size) {
      return new this.arcgis.SimpleLineSymbol(
        this.arcgis.SimpleLineSymbol.STYLE_SOLID,
        new this.arcgis.Color(color),
        size
      );
    },
    // 创建填充符号
    createMarkerSymbol(lineSymbol, size, color) {
      return new this.arcgis.SimpleMarkerSymbol(
        this.arcgis.SimpleMarkerSymbol.STYLE_CIRCLE,
        lineSymbol,
        size,
        new this.arcgis.Color(color)
      );
    },
    // 创建填充符号
    createFillSymbol(lineSymbol, color, size) {
      return new this.arcgis.SimpleFillSymbol(
        this.arcgis.SimpleFillSymbol.STYLE_SOLID,
        lineSymbol,
        new this.arcgis.Color(color),
        size
      );
    },
    addPointsToMap(featureSet) {
      if (featureSet.features[0] != undefined) {
        this.show = !this.show;
      }
    },
    initMap2() {
      let map = new this.arcgis.Map("MapView2", {
        logo: true,
        basemap: "hybrid",
        center: [114.48736263, 36.5727041],
        zoom: 16
      }); // 创建地图实例
      map.spatialReference = new this.arcgis.SpatialReference(4326);
      this.gisInst.map = map; // 绑定到组件，方便操作
      let urlStatic =
        "http://47.92.153.85:6080/arcgis/rest/services/school/school_buildings/MapServer";
      // 指定ArcServer地址End
      let layer = new this.arcgis.ArcGISDynamicMapServiceLayer(urlStatic);
      this.gisInst.map.addLayer(layer);
    },
    change() {
      this.mapshow = !this.mapshow;
      this.init();
      this.init2();
    },
    close() {
      this.show = false;
    },
    search(keywords) {
      var newList = [];
      this.list.forEach(item => {
        if (item.nickname.indexOf(keywords) !== -1) {
          newList.push(item);
        }
      });
      return newList;
    },
    // add() {
    //   var toolbar = new this.arcgis.Draw(this.gisInst.map, {
    //     showTooltips: true
    //   });
    //   toolbar.activate(this.arcgis.Draw.POINT);
    //   this.arcgis.on(toolbar, "draw-complete", function(result) {
    //     alert(0);
    //     console.log(result);
    //     var geometry = result.geometry;
    //     var graphic;
    //     graphic = new this.arcgis.Graphic(geometry);
    //     this.gisInst.map.graphics.add(graphic);
    //     this.gisInst.toolbar.deactivate();
    //   });
    // },
    add() {
      this.gisInst.navToolbar.deactivate();
      this.gisInst.toolbars.activate(this.arcgis.Draw.POINT);
    }
  }
};
</script>
<style scoped>
.map {
  width: 100%;
  height: 100vh;
}
.btn {
  position: absolute;
  z-index: 2;
  top: 20px;
  right: 20px;
}
#content {
  position: absolute;
  z-index: 3;
  right: 0;
  width: 400px;
  height: 500px;
  border: 1px solid black;
  border-radius: 5px;
}
.add {
  width: 50px;
  height: 50px;
  position: absolute;
  z-index: 2;
  bottom: 130px;
  left: 500px;
}
.qq {
  width: 50px;
  height: 50px;
  position: absolute;
  z-index: 2;
  bottom: 130px;
  left: 580px;
}
</style>
