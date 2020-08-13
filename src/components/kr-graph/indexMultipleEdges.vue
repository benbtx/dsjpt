<template>
  <div :style="{'width': '100%','height': graphHeight+'px'}" id="full">
    <div class="graphBox" id="main"></div>
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
      }
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
      }
    },
    data() {
      const $shelf = this;
      return {
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
        isZoomMove:false
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
        d3.select("#main")
          .select("svg")
          .remove();
      },

      //创建图形
      createSvg(data) {
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
          })
          .on("mousedown", () => {
            if (d3.event.button == 0){
              this.isZoomMove=false
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

        //links 添加size 和  linknum属性//用于对边生成
        this.addSize_Linknum(links);
        console.log(links);
     


        // 绑定力导向图数据
        this.force
          .nodes(accountList) // 设定节点数组
          .links(links); // 设定连线数组

        // 开启力导向布局
        this.force.start();

        // // 手动快速布局
        for (let i = 0, n = 100000; i < n; ++i) {
          this.force.tick();
        }
        // 停止力布局
        this.force.stop();
        this.nodeData = accountList;
        this.linkData = links;

        // 节点连线
        this.linkLine = this.container
          .append("g")
          .selectAll(".link")
          .data(this.force.links())
          .enter()
          .append("path")
          .attr("class", "link")
          .attr({
            d: link => this.genLinkPath2(link),
            id: link => "link-" + link.id
          })
          .style("stroke",this.lineConf.strokeColor);

        //线点击事件
        this.linkLine
          .on("click", currNode => {
            this.lineClick(currNode);
            console.log(currNode);
            // eventBus.$emit(
            //       eventCollection.yjfx_fgzsdyjfx,
            //     currNode
            //   );
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
        this.lineText = this.container
          .append("g")
          .selectAll(".linetext")
          .data(this.force.links())
          .enter()
          .append("text")
          .style("font-size", this.lineTextFontSize)
          .attr({
            class: "linetext",
            id: link => "linktext" + link.id,
            dx: link => this.getLineTextDx(link),
            dy: 5
          });
        this.lineText
          .append("textPath")
          .attr("xlink:href", link => "#link-" + link.id)
          .text(link => link.label);

        // 节点（圆）
        this.nodeCircle = this.container
          .append("g")
          .selectAll(".node")
          .data(this.force.nodes())
          .enter()
          .append("g")
          .style("cursor", "pointer")
          .attr("class", "node")
          .attr("cx", node => node.x)
          .attr("cy", node => node.y)
          .call(this.drag); // 节点可拖动

        //添加circle
        this.nodeCircle
          .append("circle")
          .style("fill", node => this.nodeConf.fillColor)
          .attr("class", "node-circle")
          .attr("id", node => "node-circle-" + node.id)
          .attr("r", this.nodeConf.radius);

        // 鼠标交互
        this.nodeCircle
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
              this.nodeClick(currNode);
              this.nodeToggleClick(currNode);
            }
          });

        // 节点文字
        this.nodeCircle
          .append("text")
          .attr("class", "nodetext")
          .attr("id", node => "node-text-" + node.id)
          .style("font-size", this.nodeTextFontSize)
          .style("font-weight", 400)
          .style("fill", () => this.nodeConf.textFillColor)
          .attr("text-anchor", "middle")
          .attr("dy", "2.5em")
          .text(d => d.name);

        // 更新力导向图
        // 注意1：必须调用一次 tick （否则，节点会堆积在左上角）
        // 注意2：调用位置必须在 nodeCircle, nodeText, linkLine, lineText 后
        setTimeout(() => {
          this.tick();
        }, 0);

        // 监听力学图运动事件，更新坐标
        this.force.on("tick", this.tick);
      },

      // 更新力导向图
      tick() {
        const shelf = this;

        this.nodeCircle.attr(
          "transform",
          node => "translate(" + node.x + "," + node.y + ")"
        );
        // 连线路径
        this.linkLine.attr("d", link => this.genLinkPath2(link));
        // 连线文字位置
        this.lineText.attr("dx", link => this.getLineTextDx(link));
        // 连线文字角度
        this.lineText.attr("transform", function(link) {
          return shelf.getLineTextAngle(link, this.getBBox());
        });
      },

      genLinks(relations) {
        const indexHash = {};

        return relations.map(({ id, source, target,label,type }) => {
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
            type,
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
      genLinkPath2(d) {
          //如果连接线连接的是同一个实体，则对path属性进行调整，绘制的圆弧属于长圆弧，同时对终点坐标进行微调，避免因坐标一致导致弧无法绘制
        if (d.target == d.source) {
            dr = 30 / d.linknum;
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 1,1 " + d.target.x + "," + (d.target.y + 1);
        } else if (d.size % 2 != 0 && d.linknum == 1) { //如果两个节点之间的连接线数量为奇数条，则设置编号为1的连接线为直线，其他连接线会均分在两边
            return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
        }
        //根据连接线编号值来动态确定该条椭圆弧线的长半轴和短半轴，当两者一致时绘制的是圆弧
        //注意A属性后面的参数，前两个为长半轴和短半轴，第三个默认为0，第四个表示弧度大于180度则为1，小于则为0，这在绘制连接到相同节点的连接线时用到；第五个参数，0表示正角，1表示负角，即用来控制弧形凹凸的方向。本文正是结合编号的正负情况来控制该条连接线的凹凸方向，从而达到连接线对称的效果
        var curve = 1.5;
        var homogeneous = 1.2;
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy) * (d.linknum + homogeneous) / (curve * homogeneous);
        //当节点编号为负数时，对弧形进行反向凹凸，达到对称效果
        if (d.linknum < 0) {
            dr = Math.sqrt(dx * dx + dy * dy) * (-1 * d.linknum + homogeneous) / (curve * homogeneous);
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,0 " + d.target.x + "," + d.target.y;
        }
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
  
      },

      //给两个节点之间 加两个属性 一个表示两个节点有多少连线 ，一个按 0 1，-1  2，-2形式让连线对称分部
      addSize_Linknum(links){
          //关系分组
          var linkGroup = {};

          //对连接线进行统计和分组，不区分连接线的方向，只要属于同两个实体，即认为是同一组
          var linkmap = {}
          for (var i = 0; i < links.length; i++) {
              var key = links[i].source.id < links[i].target.id ? links[i].source.id + ':' + links[i].target.id : links[i].target.id + ':' + links[i].source.id;
              if (!linkmap.hasOwnProperty(key)) {
                  linkmap[key] = 0;
              }
              linkmap[key] += 1;
              if (!linkGroup.hasOwnProperty(key)) {
                  linkGroup[key] = [];
              }
              linkGroup[key].push(links[i]);
          }
          //为每一条连接线分配size属性，同时对每一组连接线进行编号
          for (var i = 0; i < links.length; i++) {
              var key = links[i].source.id < links[i].target.id ? links[i].source.id + ':' + links[i].target.id : links[i].target.id + ':' + links[i].source.id;
              links[i].size = linkmap[key];
              //同一组的关系进行编号
              var group = linkGroup[key];
              var keyPair = key.split(':');
              var type = 'noself'; //标示该组关系是指向两个不同实体还是同一个实体
              if (keyPair[0] == keyPair[1]) {
                  type = 'self';
              }
              //给节点分配编号
               this.setLinkNumber(group, type);
          }
          

      },

      setLinkNumber(group, type) {
          if (group.length == 0) return;
          //对该分组内的关系按照方向进行分类，此处根据连接的实体ASCII值大小分成两部分
          var linksA = [],
              linksB = [];
          for (var i = 0; i < group.length; i++) {
              var link = group[i];
              if (link.source.id < link.target.id) {
                  linksA.push(link);
              } else {
                  linksB.push(link);
              }
          }
          //确定关系最大编号。为了使得连接两个实体的关系曲线呈现对称，根据关系数量奇偶性进行平分。
          //特殊情况：当关系都是连接到同一个实体时，不平分
          var maxLinkNumber = 0;
          if (type == 'self') {
              maxLinkNumber = group.length;
          } else {
              maxLinkNumber = group.length % 2 == 0 ? group.length / 2 : (group.length + 1) / 2;
          }
          //如果两个方向的关系数量一样多，直接分别设置编号即可
          if (linksA.length == linksB.length) {
              var startLinkNumber = 1;
              for (var i = 0; i < linksA.length; i++) {
                  linksA[i].linknum = startLinkNumber++;
              }
              startLinkNumber = 1;
              for (var i = 0; i < linksB.length; i++) {
                  linksB[i].linknum = startLinkNumber++;
              }
          } else { //当两个方向的关系数量不对等时，先对数量少的那组关系从最大编号值进行逆序编号，然后在对另一组数量多的关系从编号1一直编号到最大编号，再对剩余关系进行负编号
              //如果抛开负号，可以发现，最终所有关系的编号序列一定是对称的（对称是为了保证后续绘图时曲线的弯曲程度也是对称的）
              var biggerLinks, smallerLinks;
              if (linksA.length > linksB.length) {
                  biggerLinks = linksA;
                  smallerLinks = linksB;
              } else {
                  biggerLinks = linksB;
                  smallerLinks = linksA;
              }

              var startLinkNumber = maxLinkNumber;
              for (var i = 0; i < smallerLinks.length; i++) {
                  smallerLinks[i].linknum = startLinkNumber--;
              }
              var tmpNumber = startLinkNumber;

              startLinkNumber = 1;
              var p = 0;
              while (startLinkNumber <= maxLinkNumber) {
                  biggerLinks[p++].linknum = startLinkNumber++;
              }
              //开始负编号
              startLinkNumber = 0 - tmpNumber;
              for (var i = p; i < biggerLinks.length; i++) {
                  biggerLinks[i].linknum = startLinkNumber++;
              }
          }
      },


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
          setTimeout(()=>{
            node.fixed=true
          })
        }
        this.draging = false;
        this.dragNode = "";
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
          //自己指向自己
          if(distance==0){
           return 3.14*sr||50;
          }
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
      }
    },
    watch: {
      graphData() {
        this.emptyData();
        console.log( this.graphData);
        //调试数据
        //   // this.graphData.accountList=[];
        //   // this.graphData.relateList=[];

        // this.graphData.accountList.push({
        //  id: "588764196007087671",
        //   zjhm: "588764196007087671",
        //   yx: "588764196007087671@qq.com",
        //   name: "66",
        // });
        //  this.graphData.accountList.push({
        //  id: "518221196812098537@qq.com",
        //   zjhm: "518221196812098537@qq.com",
        //   yx: "518221196812098537@qq.com",
        //   name: "77",
        // });

        // this.graphData.relateList.push({
        //   source: "588764196007087671",
        //   target: "518221196812098537@qq.com",
        //   label: 4,
        // });
        //  this.graphData.relateList.push({
        //   source: "588764196007087671",
        //   target: "518221196812098537@qq.com",
        //   label: 44,
        // });
        // this.graphData.relateList.push({
        //   source: "588764196007087671",
        //   target: "518221196812098537@qq.com",
        //   label: 444,
        // });

           //调试数据

        this.graphData.relateList.map(value => {
          value.id = this.setLinkId();
        });
        this.createSvg(this.graphData);
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
    fill:none;
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
