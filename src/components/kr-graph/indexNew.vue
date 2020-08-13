<template>
  <div :style="{'width': '100%','height': graphHeight+'px'}" id="full">
    <div v-if="toolbar.length">
      <el-tooltip v-for="item in toolbarList"  class="item" effect="dark" :content="item.name" placement="bottom" :key="item.name">
        <div class="radioButton" @click="toolbarClick(item)" :style="setToolbarStyle(item.isClick)">
            <i :class="item.icon"></i>
        </div>
      </el-tooltip>
    </div>
    <div class="graphBox" id="main"></div>
    <el-dialog
      width="400px"
      :visible.sync="addNodeVisible"
      :close-on-click-modal="false"
      @close="close">
      <div slot="title">{{addTitle}}</div>
      <el-form :model="addForm" :rules="rules" ref="ruleForm" v-if="isNewNode">
        <el-form-item label="名称"
                      prop="pgProperty"
                      label-width="100px">
          <el-input v-model="addForm.pgProperty"
                    ref="focusInput"
                    clearable
                    autocomplete="off" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="类型"
                      prop="pgType"
                      label-width="100px">
          <el-select v-model="addForm.pgType" placeholder="请选择" style="width: 200px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form :model="relationForm" :rules="rules1" ref="ruleForm" v-if="isNewLink">
        <el-form-item label="类型"
                      prop="pgType"
                      label-width="100px">
          <el-select ref="focusInput" v-model="relationForm.pgType" placeholder="请选择" style="width: 200px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="次数"
                      prop="count"
                      label-width="100px">
          <el-input v-model="relationForm.count"
                    clearable
                    autocomplete="off" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="权重"
                      prop="weight"
                      label-width="100px">
          <el-input v-model="relationForm.weight"
                    clearable
                    autocomplete="off" style="width: 200px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="handlAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import eventBus from "../../event";
import { eventCollection } from "../../event/resources";

  import d3 from "d3/d3.min.js";
  export default {
    components: {},
    name: "index",
    props: {
      //基本节点和连线
      graphData: {
        type: Object
      },
      flowLine:{
        type: Array,
        default(){
          return []
        }
      },
      toolbar:{
        type: Array,
        default(){
          return []
        }
      },
      nodeClickToggle:{
        type: Boolean,
        default:false
      },
      maxClickNum:{
        type:Number,
        default:1
      },
      menus:{
        type: Array,
        default(){
          return []
        }
      },
      //高亮节点和连线
      tipNodeLine:{
        type: Object,
        default(){
          return {
            accountList: [],
            relateList: []
          }
        }
      },
      isHover:{
        type: Boolean,
        default:true
      },
      moreNodesToggle:{
        type: Boolean,
        default:false
      },
      graphHeight:{
        type:Number,
        default:600
      },
      lineOptions:{
        type: Array,
        default(){
          return []
        }
      },
      nodeOptions:{
        type: Array,
        default(){
          return []
        }
      },
    },
    computed: {
      menuNav(){
        var list=[]
        this.menus.map(value => {
          list.push({
            event: value,
            proportion: 1
          })
        })
        return list
      },
    },
    data() {
      const $shelf = this;
      var weight = (rule, value, callback) => {
        if (!value||!value.trim()||!/^(\-|\+)?\d+(\.\d+)?$/.test(value)) {
          callback(new Error('请输入数字'));
        } else {
          callback();
        }
      };
      var count = (rule, value, callback) => {
        if (!value||!value.trim()||!/(^[1-9]\d*$)/.test(value)) {
          callback(new Error('请输入正整数'));
        } else {
          callback();
        }
      };
      return {
        options:[],
        toolbarList:[],
        isClick: false,
        relateData: {
          accountList: [],
          relateList: []
        },
        width: "",
        height: "",
        initScale: 1,
        draging: false,
        nodeConf: {
          fillColor: "#33CCCC",
          borderColor: "#33CCCC",
          strokeColor: "none",
          strokeWidth: 1,
          textFillColor: "#727272",
          radius: 20,
          clickFillColor:"#3da6ff"
        },
        lineConf: {
          strokeColor: "#727272"
        },
        nodeTextFontSize: 12,
        lineTextFontSize: 12,
        menuInnerRadius: 16,
        menuOuterRadius: 50,
        nodesMap: {},
        linkMap: {},
        nodeData: [],
        linkData: [],
        clickNode: {},
        zoomOverlay: {},
        linkId: 0,
        imageWidth: 18,
        imageHeight: 18,
        isMenu: false,
        hideNodeList: [],
        dragNode: "",
        dragNodePx: "",
        dragNodePy: "",
        isTrick: false,
        timer: "",
        translate: [0, 0],
        isSelect: false,
        selectScale: 1,
        clickNodes:[],
        isZoomMove:false,
        isNewNode:false,
        isNewLink:false,
        addNodeVisible:false,
        addD3Event:"",
        addTitle:"",
        addLabel:"",
        addForm:{
          pgType:"",
          pgProperty:""
        },
        relationForm:{
          weight:"",
          pgType:"",
          count:"",
        },
        allNodes:[],
        allLinks:[],
        addLinkList:[],
        isFixed:false,
        rules: {
          pgProperty: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
          pgType: [
            { required: true, message: '请选择类型', trigger: 'change' }
          ],
        },
        rules1: {
          weight: [
            { required: true, message: '请输入权重', trigger: 'blur' },
            {  required: true,validator: weight, trigger: 'blur' }
          ],
          count: [
            { required: true, message: '请输入次数', trigger: 'blur' },
            { required: true, validator: count, trigger: 'blur' }
          ],
          pgType: [
            { required: true, message: '请选择类型', trigger: 'change' }
          ],
        },
      };
    },
    mounted() {
      document.removeEventListener("keydown", this.keydownEvent);
      document.removeEventListener("keyup", this.keyupEvent);
      document.getElementById("main").oncontextmenu = function() {
        return false;
      };
      this.width = document.getElementById("main").offsetWidth;
      this.height = document.getElementById("main").offsetHeight;
      this.createEventListener();
    },
    methods: {

      changeResize() {
        this.width = document.getElementById("main").offsetWidth;
        this.height = document.getElementById("main").offsetHeight;
        this.force.size([this.width, this.height]);
        d3.select("svg .background")
          .attr("width", this.width)
          .attr("height", this.height);

        d3.select("#main")
          .select("svg")
          .attr("width", this.width)
          .attr("height", this.height);
      },

      changeZoom() {
        this.translate = this.zoom.translate();
        this.container.attr(
          "transform",
          "translate(" + this.translate + ")scale(" + this.zoom.scale() + ")"
        );
      },
      //创建事件监听（监听ctrl+z事件）
      createEventListener() {
        const shelf = this;
        document.addEventListener("keydown", shelf.keydownEvent);
        document.addEventListener("keyup", shelf.keyupEvent);
      },

      //监听键盘keydown事件
      keydownEvent(event) {
        const shelf = this;
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 17) {
          shelf.isCrtl = true;
        }
        if (e && e.keyCode == 90) {
          if (shelf.isCrtl) {
            shelf.revokeDelete(1);
          }
        }
      },

      //监听键盘keydup事件
      keyupEvent(event) {
        const shelf = this;
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 17) {
          shelf.isCrtl = false;
        }
      },

      //清空数据（为重新绘制图形做准备）
      emptyData() {
        this.nodesMap = {};
        this.linkMap = {};
        this.linkMap = [];
        this.linkData = [];
        this.relateData = {
          accountList: [],
          relateList: []
        };
        this.dragNode = "";
        this.isTrick = false;
        this.translate = [0, 0];
        this.isSelect = false;
        this.selectScale = 1;
        this.toolbarList = [];
        d3.select("#main")
          .select("svg")
          .remove();
      },

      //创建图形
      createSvg(data) {
        this.toolbarList=[...this.toolbar]
        this.force = d3.layout
          .force()
          .size([this.width, this.height]) // 画布的大小
          .linkDistance(100) // 连线长度
          .charge(-2000); // 排斥/吸引，值越小越排斥

        // 全图缩放器
        this.zoom = d3.behavior
          .zoom()
          .scaleExtent([0.25, 2])
          .on("zoom", this.zoomFn);

        // 节点拖拽器（使用 d3.behavior.drag 节点拖动失效）
        this.drag = this.force
          .drag()
          .origin(d => d)
          .on("dragstart", this.dragstartFn)
          .on("drag", this.dragFn)
          .on("dragend", this.dragendFn);

        // SVG
        this.svg = d3
          .select("#main")
          .append("svg")
          .attr("width", this.width)
          .attr("height", this.height)
          .append("g")
          .call(this.zoom)
          .on("dblclick.zoom", null);
        // 缩放层（位置必须在 container 之前）
        this.zoomOverlay = this.svg
          .append("rect")
          .attr("width", this.width)
          .attr("height", this.height)
          .attr("class", "background")
          .style("fill", "none")
          .style("cursor", "move")
          .style("pointer-events", "all")
          .on("click", () => {
            if((this.nodeClickToggle||this.moreNodesToggle)&&!this.isZoomMove){
              this.clearStatus();
            }
            if (this.isNewNode == true) {
              this.addNodeVisible = true;
              this.addD3Event = d3.event;
              this.options=this.nodeOptions
            }
          })
          .on("mousedown", () => {
            if (d3.event.button == 0){
              this.isZoomMove=false
            }
          })

        this.svg.on("mousemove", () => {

          if (this.isNewLink && this.addLinkList.length == 1) {
            var m =
              "M" +
              this.addLinkList[0].x +
              "," +
              this.addLinkList[0].y +
              " L" +
              (d3.event.offsetX / this.zoom.scale() -
                this.translate[0] / this.zoom.scale()) +
              "," +
              (d3.event.offsetY / this.zoom.scale() -
                this.translate[1] / this.zoom.scale());
            d3.select(".movePath")
              .style("stroke", () => this.lineConf.strokeColor)
              .attr("stroke-dasharray", "2 2")
              .attr("d", m);
          }
        });

        this.container = this.svg
          .append("g")
          .attr("transform", "scale(" + this.initScale + ")")
          .attr("class", "container");

        // 初始化
        setTimeout(() => {
          this.initialize(data);
        }, 0);
      },

      // 初始化
      initialize(resp) {
        const shelf = this;

        let { accountList, relateList } = resp;

        // 生成 nodes map
        this.nodesMap = this.genNodesMap(accountList);

        // 构建 nodes
        accountList = d3.values(this.nodesMap);

        // 起点和终点相同的关系映射
        this.linkMap = this.genLinkMap(relateList);

        // 构建 links
        const links = this.genLinks(relateList);

        // 绑定力导向图数据
        this.force
          .nodes(accountList) // 设定节点数组
          .links(links); // 设定连线数组

        // 开启力导向布局
        this.force.start();
        this.isTrick=false
        // // 手动快速布局
        for (let i = 0, n = 1000; i < n; ++i) {
          this.isTrick=true
          this.force.tick();
        }
        // 停止力布局
        this.force.stop();
        this.isTrick=false
        this.nodeData = accountList;
        this.linkData = links;
        // 固定所有节点
        accountList.forEach(node => {
          node.fixed =node.fixed?node.fixed:this.isFixed;
        });

        if(!this.linkLine){

          //线
          this.linkLine = this.container
            .append("g")
            .attr("id","linkGroup")
            .selectAll(".link")
            .data(this.force.links())

          //点
          this.nodeCircle = this.container
            .append("g")
            .selectAll(".node")
            .data(this.force.nodes());

          // 连线的文字
          this.lineText = this.container
            .append("g")
            .selectAll(".linetext")
            .data(this.force.links())
        }else {
          this.linkLine = this.linkLine.data(this.force.links());
          this.nodeCircle = this.nodeCircle.data(this.force.nodes());
          this.lineText = this.lineText.data(this.force.links());
          this.linkLine.exit().remove();
          this.nodeCircle.exit().remove();
          this.lineText.exit().remove();
        }

        this.loadNodeLine()
        // 监听力学图运动事件，更新坐标
        this.force.on("tick", this.tick);
      },

      //加载节点和边
      loadNodeLine(){
        const shelf = this;
        var enterLine = this.linkLine
          .enter()
          .append("path")
          .attr("class", "link")
          .attr({
            d: link => this.genLinkPath(link),
            id: link => "link-" + link.id
          })
          .style("stroke",this.lineConf.strokeColor);

        //线点击事件
        enterLine
          .on("click", currNode => {
            this.lineClick(currNode);
          })
          .on("mouseenter", currNode => {
            if (this.isClick) {
              return;
            }
            //设置定时器0.1秒之后触发（避免鼠标快速滑过造成的页面闪烁）
            this.timer = setTimeout(() => {
              this.linkToggleNode(currNode, true);
              this.linkToggleLine(currNode, true);
              this.linkToggleLineText(currNode, true);
            }, 100);
          })
          .on("mouseleave", currNode => {
            if (this.isClick) {
              return;
            }
            //清除定时器
            window.clearTimeout(this.timer);
            this.toggleNode(this.nodeCircle, currNode, false);
            this.toggleLine(this.linkLine, currNode, false);
            this.toggleLineText(this.lineText, currNode, false);
          });

        // 连线的文字
        var enterLineText = this.lineText
          .enter()
          .append("text")
          .style("font-size", this.lineTextFontSize)
          .attr({
            class: "linetext",
            id: link => "linktext" + link.id,
            dx: link => this.getLineTextDx(link),
            dy: 5
          });
        enterLineText
          .append("textPath")
          .attr("xlink:href", link => "#link-" + link.id)
          .text(link => link.label);

        // 连线的文字
        var enterNodeCircle = this.nodeCircle
          .enter()
          .append("g")
          .style("cursor", "pointer")
          .attr("class", "node")
          .attr("cx", node => node.x)
          .attr("cy", node => node.y)
          .call(this.drag); // 节点可拖动

        //添加circle
        enterNodeCircle
          .append("circle")
          .style("fill", node => this.nodeConf.fillColor)
          .attr("class", "node-circle")
          .attr("id", node => "node-circle-" + node.id)
          .attr("r",this.nodeConf.radius);

        // 鼠标交互
        enterNodeCircle
          .on("mouseenter", currNode => {
            if ((this.draging || this.isClick)&&this.nodeClickToggle) {
              return;
            }
            //设置定时器0.1秒之后触发（避免鼠标快速滑过造成的页面闪烁）
            this.timer = setTimeout(() => {
              this.toggleNode(this.nodeCircle, currNode, true);
              this.toggleLine(this.linkLine, currNode, true);
              this.toggleLineText(this.lineText, currNode, true);
            }, 100);
          })
          .on("mouseleave", currNode => {
            if ((this.draging || this.isClick)&&this.nodeClickToggle) {
              return;
            }
            //清除定时器
            this.isClick = false;
            window.clearTimeout(this.timer);
            this.deleteMenu();
            this.toggleNode(this.nodeCircle, currNode, false);
            this.toggleLine(this.linkLine, currNode, false);
            this.toggleLineText(this.lineText, currNode, false);
          })
          .on("mousedown", function(currNode) {
            if(shelf.menus.length){
              shelf.menuEvent(d3.event, currNode, this);
            }
          })
          .on("click", currNode => {
            if (this.isClick) {
              if (this.isNewLink && this.addLinkList.length < 2) {
                if (
                  this.addLinkList.length == 1 &&
                  this.addLinkList[0].id == currNode.id
                ) {
                  return;
                }
                this.nodeData.map(item => {
                  if (item.id == currNode.id) {
                    this.addLinkList.push(item);
                  }
                });
                if (this.addLinkList.length == 2) {
                  this.addNodeVisible = true;
                  this.options=this.lineOptions
                } else {
                  d3.select("#main")
                    .select(".container")
                    .insert("path", "#linkGroup")
                    .attr("class", "movePath");
                }
              }
              this.nodeClick(currNode);
              this.nodeToggleClick(currNode);
            }
          });

        // 节点文字
        enterNodeCircle
          .append("text")
          .attr("class", "nodetext")
          .attr("id", node => "node-text-" + node.id)
          .style("font-size", this.nodeTextFontSize)
          .style("font-weight", 400)
          .style("fill", () => this.nodeConf.textFillColor)
          .attr("text-anchor", "middle")
          .attr("dy", "2.5em")
          .text(d => d.name);

        setTimeout(() => {
          this.tick();
        }, 0);
      },

      // 更新力导向图
      tick() {
        if(this.isTrick){
          return
        }
        this.updatePosition()
      },

      updatePosition(){
        const shelf = this;
        this.nodeCircle
          .filter(node => this.isNeedMove("node", node))
          .attr(
            "transform",
            node => "translate(" + node.x + "," + node.y + ")"
          );
        // 连线路径
        this.linkLine
          .filter(node => this.isNeedMove("line", node))
          .attr("d", link => this.genLinkPath(link));
        // 连线文字位置
        this.lineText
          .filter(node => this.isNeedMove("line", node))
          .attr("dx", link => this.getLineTextDx(link))
          .attr("transform", function(link) {
            return shelf.getLineTextAngle(link, this.getBBox());
          });
      },

      isNeedMove(type,node){
        if(!this.isFixed||!this.draging){
          return true
        }
        if(type=="node"&&node.id==this.dragNode.id){
          return true
        }
        if(type=="line"&&(node.source.id==this.dragNode.id||node.target.id==this.dragNode.id)){
          return true
        }
        return false
      },


      genLinks(relations) {
        const indexHash = {};

        return relations.map(({ id, source, target,label }) => {
          const linkKey = source + "-" + target;
          const count = this.linkMap[linkKey];
          if (indexHash[linkKey]) {
            indexHash[linkKey] -= 1;
          } else {
            indexHash[linkKey] = count - 1;
          }
          return {
            id,
            source: this.nodesMap[source],
            target: this.nodesMap[target],
            label,
            count: this.linkMap[linkKey],
            index: indexHash[linkKey]
          };
        });
      },

      genLinkMap(relations) {
        const hash = {};
        relations.map(({ source, target, score }) => {
          const key = source + "-" + target;
          if (hash[key]) {
            hash[key] += 1;
            hash[key + "-label"] += "、" + score;
          } else {
            hash[key] = 1;
            hash[key + "-label"] = score;
          }
        });
        return hash;
      },

      genNodesMap(nodes) {
        const hash = {};
        nodes.map(value => {
          hash[value.id] = value;
        });
        return hash;
      },

      // 生成关系连线路径
      genLinkPath(link) {
        let sx = link.source.x;
        let tx = link.target.x;
        let sy = link.source.y;
        let ty = link.target.y;

        return "M" + sx + "," + sy + " L" + tx + "," + ty;
      },

      getLineAngle(sx, sy, tx, ty) {
        // 两点 x, y 坐标偏移值
        const x = tx - sx;
        const y = ty - sy;
        // 斜边长度
        const hypotenuse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) | 1;
        // 求出弧度
        const cos = x / hypotenuse;
        const radian = Math.acos(cos);
        // 用弧度算出角度
        let angle = 180 / (Math.PI / radian);
        if (y < 0) {
          angle = -angle;
        } else if (y == 0 && x < 0) {
          angle = 180;
        }
        return angle;
      },

      zoomFn() {
        const { scale } = d3.event;
        this.isZoomMove=true
        if (!this.isSelect) {
          this.translate[0] = this.translate[0] + d3.event.sourceEvent.movementX;
          this.translate[1] = this.translate[1] + d3.event.sourceEvent.movementY;
        }
        this.selectScale = scale;
        this.container.attr(
          "transform",
          "translate(" + this.translate + ")scale(" + scale * this.initScale + ")"
        );
      },

      dragstartFn(node) {
        this.draging = true;
        this.dragNode = node;
        this.dragNodePx = node.px;
        this.dragNodePy = node.py;
        if (d3.event.sourceEvent.button == 2) {
          this.isClick = false;
        } else {
          this.isClick = true;
        }
        d3.event.sourceEvent.stopPropagation();
      },

      dragFn(node) {
        this.draging = true;
        this.isClick = false;
        this.force.start();
      },

      dragendFn(node) {
        if(this.draging){
          node.fixed=true
        }
        this.draging = false;
        this.dragNode = "";
        setTimeout(()=>{
          this.force.stop();
        },1000)

      },

      isLinkLine(node, link) {
        return link.source.id == node.id || link.target.id == node.id;
      },

      isLinkNode(currNode, node) {
        if (currNode.id === node.id) {
          return true;
        }
        return (
          this.linkMap[currNode.id + "-" + node.id] ||
          this.linkMap[node.id + "-" + currNode.id]
        );
      },

      getLineTextDx(d) {
        const sr = this.nodeConf.radius;
        const sx = d.source.x;
        const sy = d.source.y;
        const tx = d.target.x;
        const ty = d.target.y;

        const distance = Math.sqrt(Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2));

        // const textLength = d.label.length;
        const textLength = d.label.toString().length;
        const deviation = 8; // 调整误差
        const dx =
          (distance - sr - textLength * this.lineTextFontSize) / 2 + deviation;
        return dx;
      },

      //计算线文字的角度
      getLineTextAngle(d, bbox) {
        if (d.target.x < d.source.x) {
          const { x, y, width, height } = bbox;
          const rx = x + width / 2;
          const ry = y + height / 2;
          return "rotate(180 " + rx + " " + ry + ")";
        } else {
          return "rotate(0)";
        }
      },

      //节点hover时改变节点的opacity
      toggleNode(nodeCircle, currNode, isHover) {
        if(!this.isHover){
          return
        }
        if (isHover) {
          nodeCircle.sort((a, b) => a.id === currNode.id ? 1 : -1);
          this.allNodes.sort((a, b) => (a.id === currNode.id ? 1 : -1));
          nodeCircle
            .style("opacity", 0.1)
            .filter(node => this.isLinkNode(currNode, node))
            .style("opacity", 1);
        } else {
          nodeCircle.style("opacity", 1);
        }
      },

      //节点hover时改变线的opacity
      toggleLine(linkLine, currNode, isHover) {
        if(!this.isHover){
          return
        }
        if (isHover) {
          // 加重连线样式
          linkLine
            .style("opacity", 0.1)
            .filter(link => this.isLinkLine(currNode, link))
            .style("opacity", 1)
            .classed("link-active", true);
        } else {
          // 连线恢复样式
          linkLine.style("opacity", 1).classed("link-active", false);
        }
      },

      //节点hover时改变线文字的opacity
      toggleLineText(lineText, currNode, isHover) {
        if(!this.isHover){
          return
        }
        if (isHover) {
          // 只显示相连连线文字
          lineText.style(
            "fill-opacity",
            link => (this.isLinkLine(currNode, link) ? 1.0 : 0.0)
          );
        } else {
          // 显示所有连线文字
          lineText.style("fill-opacity", "1.0");
        }
      },

      //线hover时改变线的opacity
      linkToggleLine(currNode, isHover) {
        if(!this.isHover){
          return
        }
        if (isHover) {
          // 加重连线样式
          this.linkLine
            .style("opacity", 0.1)
            .filter(link => {
              if (
                link.source.id == currNode.source.id &&
                link.target.id == currNode.target.id
              ) {
                return true;
              } else {
                return false;
              }
            })
            .style("opacity", 1)
            .classed("link-active", true);
        } else {
          // 连线恢复样式
          this.linkLine.style("opacity", 1).classed("link-active", false);
        }
      },

      //线hover时改变节点的opacity
      linkToggleNode(currNode, isHover) {
        if(!this.isHover){
          return
        }
        if (isHover) {
          this.nodeCircle
            .style("opacity", 0.1)
            .filter(
              node =>
                node.id == currNode.target.id || node.id == currNode.source.id
            )
            .style("opacity", 1);
        } else {
          this.nodeCircle.style("opacity", 1);
        }
      },

      //线hover时改变线文字的opacity
      linkToggleLineText(currNode, isHover) {
        if(!this.isHover){
          return
        }
        if (isHover) {
          // 只显示相连连线文字
          this.lineText.style(
            "fill-opacity",
            link =>
              link.source.id == currNode.source.id &&
              link.target.id == currNode.target.id
                ? 1.0
                : 0.0
          );
        } else {
          // 显示所有连线文字
          this.lineText.style("fill-opacity", "1.0");
        }
      },

      //节点选中时的状态
      nodeToggleClick(currNode) {
        this.nodeCircle
          .select("circle")
          .style("fill", this.nodeConf.fillColor);
        this.nodeCircle
          .filter(node => this.clickNodes.findIndex(a=>a.id==node.id)!=-1)
          .select("circle")
          .style("fill", this.nodeConf.clickFillColor);
        if(this.nodeClickToggle){
          this.toggleNode(this.nodeCircle, currNode, true);
          this.toggleLine(this.linkLine, currNode, true);
          this.toggleLineText(this.lineText, currNode, true);
        }
      },

      nodesToggle(nodes){
        if(nodes&&!nodes.length){
          this.clearStatus()
          return
        }
        this.nodeCircle
          .style("opacity", 0.1)
          .filter(node => {
            var is=false
            nodes.map(value=>{
              if(value.id==node.id){
                is=true
              }
              if(this.linkMap[value.id + "-" + node.id] ||
                this.linkMap[node.id + "-" + value.id]){
                is=true
              }
            })
            return is
          })
          .style("opacity", 1);
        this.linkLine
          .style("opacity", 0.1)
          .filter(link => nodes.findIndex(a=>a.id==link.source.id||a.id==link.target.id)!=-1)
          .style("opacity", 1)
          .classed("link-active", true);
        this.lineText
          .style("fill-opacity", "0.1")
          .filter(link => nodes.findIndex(a=>a.id==link.source.id||a.id==link.target.id)!=-1)
          .style("fill-opacity", "1.0")
      },

      //设置连线id
      setLinkId() {
        var id = "lin_" + this.linkId;
        this.linkId++;
        return id;
      },

      //创建鼠标右键菜单
      createMenu(th) {
        d3.selectAll(".menu").remove();

        var menu = d3
          .select(th)
          .append("g")
          .attr("class", "menu");
        var arc_generator = d3.svg
          .arc()
          .innerRadius(this.menuInnerRadius)
          .outerRadius(this.menuOuterRadius);

        var angle_data = d3.layout.pie().value(d => {
          return d.proportion;
        });

        var pieg = menu
          .selectAll("g")
          .data(angle_data(this.menuNav))
          .enter()
          .append("g")
          .attr("class", "pie")
          .on("click", d => {
            switch (d.data.event) {
              case "隐藏":

                break;
              case "添加关系":

                break;
            }
          });

        //pie
        pieg
          .append("path")
          .attr("d", arc_generator)
          .style("stroke", "black");

        //text
        pieg
          .append("text")
          .text(d => {
            return d.data.event;
          })
          .attr("transform", d => {
            var deg = (((d.startAngle + d.endAngle) / Math.PI) * 180) / 2;
            return (
              "translate(" + arc_generator.centroid(d) + ") rotate(" + deg + ")"
            );
          })
          .attr("text-anchor", "middle")
          .attr("dy", "5")
          .attr("class", "pieText");
        menu.on("click", () => {
          d3.event.stopPropagation();
          this.deleteMenu();
          this.toggleNode(this.nodeCircle, {}, false);
          this.toggleLine(this.linkLine, {}, false);
          this.toggleLineText(this.lineText, {}, false);
          this.isMenu = false;
          this.showMenu();
        });
        this.showMenu();
      },

      //删除右键菜单
      deleteMenu() {
        this.container.selectAll(".menu").remove();
      },

      showMenu() {
        if (this.isMenu) {
          d3.selectAll(".menu").attr("opacity", "1");
        } else {
          d3.selectAll(".menu").attr("opacity", "0");
        }
      },


      //节点鼠标右键事件
      menuEvent(event, currNode, th) {
        if (event.button == 2) {
          this.clickNode = currNode;
          this.createMenu(th);
          this.isMenu = true;
          this.showMenu();
        } else if (event.button == 0) {
          // this.nodeClick(currNode);
        }
      },

      //点击连线
      lineClick(currNode) {
        this.$emit("lineClick",currNode)
      },

      //点击节点
      nodeClick(currNode) {
        if(!this.maxClickNum){
          return
        }
        if(this.clickNodes.findIndex(a=>a.id==currNode.id)==-1){
          if(this.clickNodes.length<this.maxClickNum){
            this.clickNodes.push(currNode)
          }else {
            this.clickNodes.splice(0,1)
            this.clickNodes.push(currNode)
          }
        }else {
          this.clickNodes.splice(this.clickNodes.findIndex(a=>a.id==currNode.id),1)
        }
        this.$emit("nodeClick",this.clickNodes)
        if(this.clickNodes.length==2){
          this.$emit("getPath",this.clickNodes)
        }
        this.clearLineStatus()
      },

      //清除状态
      clearStatus() {
        this.isClick = false;
        this.clickNodes=[]
        this.nodeCircle.style("opacity", 1);
        this.nodeCircle
          .select("circle")
          .style("fill", this.nodeConf.fillColor);
        this.lineText.style("fill-opacity", "1.0");
        this.linkLine.style("opacity", 1).classed("link-active", false);
      },


      flowWithLine(){
        let node=this.nodesMap[this.flowLine[0]]
        let index=0
        let arrow_path = "M2,2 L10,6 L2,10 L4,6 L2,2";
        d3.select(".flow").remove()
        this.container
          .insert("circle", "g:nth-child(3)")
          .attr("class", "flow")
          .attr("fill","red")
          .attr("r", 3)
          .attr("transform", "translate(" + node.x + "," + node.y + ")");

        this.floWchangeNode(0)
        var timer=setInterval(()=>{
          if(index<this.flowLine.length){
            this.floWchangeNode(index)
            this.moveFlow(this.flowLine[index],this.flowLine[index+1])
            index=index+1
          }else {
            window.clearInterval(timer)
            d3.select(".flow").remove()
            this.nodeCircle
              .select("circle")
              .style("fill", this.nodeConf.fillColor);
          }
        },2000)
      },


      moveFlow(sourceId,targetId){
        let source=this.nodesMap[sourceId]
        let target=this.nodesMap[targetId]
        if(target){
          d3.select(".flow")
            .attr("transform", )
          d3.select(".flow")
            .attr("transform", "translate(" + source.x + "," + source.y + ")")
            .transition()
            .duration(2000)
            .attr("transform", "translate(" + target.x + "," + target.y + ")");
        }else {
          d3.select(".flow")
            .attr("transform", "translate(" + source.x + "," + source.y + ")")
        }
      },

      floWchangeNode(index){
        let node=this.nodesMap[this.flowLine[index]]
        this.clickNodes=[]
        this.nodeCircle
          .select("circle")
          .style("fill", this.nodeConf.fillColor);
        this.nodeCircle
          .filter(d => d.id == node.id)
          .select("circle")
          .style("fill", "red");
      },

      changeClickNode(nodes){
        this.clickNodes=[]
        this.graphData.accountList.map(value=>{
          if(nodes.findIndex(a=>a==value.id)!=-1){
            this.clickNodes.push(value)
          }
        })
        this.nodeToggleClick()
      },

      searchNode(nodes){
        if(nodes.length==0){
          this.graphData.accountList.map(value=>{
            value.fixed=false
          })
          this.emptyData()
          this.createSvg(this.graphData);
        }else {
          let accountList=[],relateList=[]
          this.graphData.accountList.map(value=>{
            if(nodes.findIndex(a=>a==value.id)!=-1){
              accountList.push(value)
            }
          })
          accountList.map(value=>{
            value.fixed=false
          })
          this.graphData.relateList.map(value=>{
            if(nodes.findIndex(a=>a==value.source)!=-1&&nodes.findIndex(a=>a==value.target)!=-1){
              relateList.push(value)
            }
          })
          this.emptyData()
          this.createSvg({accountList,relateList});
        }
      },

      clearLineStatus(){
        this.linkLine
          .style("stroke",this.lineConf.strokeColor);
      },

      toolbarClick(item){
        this.toolbarList.map(value => {
          if(value.isClick==undefined){
            value.isClick = false;
          }
          if(item.name != value.name){
            value.isClick = false;
          }
        });
        item.isClick=!item.isClick
        this.toolbarList=[...this.toolbarList]
        this.isNewNode = false;
        this.isNewLink = false;
        if(item.name=="新增节点"){
          this.isNewNode=item.isClick
          this.addTitle="新增节点"
          this.addLabel = "节点名称";
        }else if(item.name=="新增关系"){
          this.isNewLink=item.isClick
          this.addTitle = "新增关系";
          this.addLabel = "关系名称";
        }
      },

      setToolbarStyle(is){
        return is?"background-color: rgba(64,158,288,1)":""
      },

      close() {
        this.addNodeVisible = false;
        this.addForm.addName = "";
        this.addLinkList = [];
        d3.select(".movePath").remove();
      },

      handlAdd() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (this.addTitle == "新增节点") {
              this.handlAddNode();
            } else if (this.addTitle == "新增关系") {
              this.handlAddLink();
            }
          } else {
            return false;
          }
        });
      },

      handlAddNode() {
        let scale=this.zoom.scale()


        let offsetX = this.addD3Event.offsetX,
          offsetY = this.addD3Event.offsetY;
        let x = offsetX/ scale - this.translate[0]/ scale,
          y = offsetY/ scale -this.translate[1] / scale;
        var node = {
          name: this.addForm.pgProperty,
          type: this.addForm.pgType,
          pgType: this.addForm.pgType,
          pgProperty: this.addForm.pgProperty,
          x,
          y,
          addType: "add",
          id: new Date().getTime(),
          fixed: true
        };
        this.addNodeVisible = false;
        this.allNodes.push(node)
        this.initialize({
          accountList: this.allNodes,
          relateList: this.allLinks
        });
      },

      handlAddLink() {
        var isHave = false;
        this.addNodeVisible = false;
        d3.select(".movePath").remove();
        this.linkData.map(value => {
          if (
            (value.source.id == this.addLinkList[0].id &&
              value.target.id == this.addLinkList[1].id) ||
            (value.target.id == this.addLinkList[0].id &&
              value.source.id == this.addLinkList[1].id)
          ) {
            isHave = true;
          }
        });
        if (isHave) {
          this.$message.warning("关系已存在！");
        } else {
          this.allLinks.push({
            source: this.addLinkList[0].id,
            target: this.addLinkList[1].id,
            id: this.setLinkId(),
            addType: "add",
            label: this.relationForm.count,
            type: this.relationForm.pgType,
            weight: this.relationForm.weight,
            count: this.relationForm.count,
            pgType: this.relationForm.pgType,
          })
          this.initialize({
            accountList: this.allNodes,
            relateList: this.allLinks
          });
        }

        this.addLinkList = [];
        this.clickNodes = [];
        this.clearStatus()
      },

      getAddData(){
        var nodes=[],links=[]
        // this.allLinks.map(value => {
        //   if(value.addType=="add"){
        //     links.push(value)
        //   }
        // })
        // this.allNodes.map(value => {
        //   if(value.addType=="add"){
        //     nodes.push(value)
        //   }
        // })
        return {nodes:this.allNodes, links:this.allLinks}
      }
    },
    watch: {
      graphData() {
        this.emptyData()
        this.graphData.relateList.map(value => {
          value.id = this.setLinkId();
        });
        this.allNodes=[...this.graphData.accountList],
        this.allLinks=[...this.graphData.relateList],
        this.createSvg({
          accountList:this.allNodes,
          relateList:this.allLinks,
        });
      },
      flowLine(){
        if(this.flowLine.length>0){
          setTimeout(()=>{
            this.flowWithLine()
          })
        }
      },
      tipNodeLine(){
        this.nodeToggleClick()
        this.nodeCircle
          .filter(d => this.tipNodeLine.accountList.findIndex(a=>a.id==d.id)!=-1&&this.clickNodes.findIndex(a=>a.id==d.id)==-1)
          .select("circle")
          .style("fill", "red");
        this.clearLineStatus()
        this.linkLine
          .filter(d => {
            let is=false
            this.tipNodeLine.relateList.map(value=>{
              if((value.source==d.source.id&&value.target==d.target.id)||(value.source==d.target.id&&value.target==d.source.id)){
                is=true
              }
            })
            return is
          })
          .style("stroke","red");
      },
      addNodeVisible() {
        if (this.addNodeVisible == true) {
          setTimeout(() => {
            this.$refs.focusInput.focus();
          });
        }
        if (this.addNodeVisible == false) {
          this.$refs.ruleForm.clearValidate();
        }
      }
    },
    destroyed(){
      document.removeEventListener("keydown", this.keydownEvent);
      document.removeEventListener("keyup", this.keyupEvent);
    }
  };
</script>

<style  module>

</style>
<style>
  .radioButton{
    display: inline-block;
    background-color: rgba(64,158,288,0.3);
    padding: 3px 10px;
    border-radius: 3px;
    margin-left: 10px;
    cursor: pointer;
  }
  #main {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  text {
    pointer-events: none;
    user-select: none;
  }

  .node:hover {
    cursor: pointer;
  }

  .link {
    stroke-opacity: 1;
    stroke-width: 2;
    cursor: pointer;
  }
  .link-active {
    stroke-opacity: 1;
    stroke-width: 3;
  }
  .linetext {
    font-family: Microsoft YaHei;
    fill: #727272;
  }

  .pie {
    cursor: pointer;
    fill: #b0f5f6;
  }
  .pie:hover {
    fill: #91cacb;
  }
  .pie:hover .pieText {
    fill: #fff;
  }
  .pieText {
    cursor: pointer;
    fill: black;
    font-size: 12px;
  }
</style>
