<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <!-- <el-button type="primary" icon="plus" @click="newAdd">新增</el-button>
      <el-button type="danger" icon="delete" @click="batchDelete">删除</el-button> -->
      <el-row style="width: 100%;">
          <el-col :span="6" :offset="0" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="el-input" style=" float: right;">
              关键字：
              <input type="text" placeholder="关键字：" v-model="searchKey" @keyup.enter="search($event)"
                    class="el-input__inner" style="width:180px">
            </div>
          </el-col>
          <el-col :span="6" :offset="0" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-button type="primary" icon="plus" @click="btnSave">保存</el-button>

            <el-button type="primary" icon="plus" @click="btnRun">运行</el-button>

            <el-button type="primary" icon="plus" @click="btnPublish">发布</el-button>

            <el-button type="primary" icon="plus" @click="btnClose">关闭</el-button>
          
           
        </el-col>
      </el-row>


    </h3>
    <el-row slot="body" :gutter="24" style="margin-bottom: 20px;">
      <el-col :span="6" :xs="24" :sm="24" :md="6" :lg="6" style="margin-bottom: 20px;">
        <el-card   class="box-card sjyleft">
            <!-- show-checkbox -->

            <div><div style="float:right;">
              <i class='el-icon-folder-add' style="font-size: 20px;margin-right:5px;cursor: pointer;" @click='addsjylx'></i>   
               <i class='el-icon-edit' style="font-size: 20px;margin-right:5px;cursor: pointer;" @click='updatesjylx'></i>  
               <i class='el-icon-delete' style="font-size: 20px;margin-right:5px;cursor: pointer;" @click='deletesjylx'></i> </div></div>


            <el-tree id='sjylxtree' class='sjytree' v-if="menuTree"
                    ref="menuTree"
                    :data="menuTree"
                  
                    highlight-current
                    :expand-on-click-node="false"
                    :default-expand-all='true'
                    :render-content="renderContent"
                    @node-click="handleNodeClick" clearable node-key="id" :props="defaultProps">
                    
                    

                    
                    </el-tree>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24" :sm="24" :md="18" :lg="18">
        <el-card class="box-card sjyright" >
            <svg id='main' width="100%" height="100%">
              <defs>
                <marker id="arrowhead" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" stroke-width="0" stroke="#333"></path>
                </marker>
              </defs>
            </svg>

            <!-- <el-table
              :data="tableData.rows"
              border
              style="width: 100%"
              v-loading="listLoading"
              @selection-change="handleSelectionChange">
            

                <el-table-column
                prop="dsName"
                label="数据源"  >
              </el-table-column>

               <el-table-column
                prop="dbName"
                label="数据库"  min-width="120">
              </el-table-column>
            
              <el-table-column
                prop="dbType"
                label="类型">
              </el-table-column>

               <el-table-column
                prop="hostName"
                label="地址"  width="150">
              </el-table-column>
               <el-table-column
                prop="port"
                label="端口"  width="60">
              </el-table-column>

           
               <el-table-column
                prop="username"
                label="用户">
              </el-table-column>
               <el-table-column
             
                label="密码">
                  <template slot-scope="scope">
                      ......
                     </template>

              </el-table-column>
             
             
              <el-table-column label="操作" width="230">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="default"
                    icon="edit"
                    @click="handleEdit(scope.$index, scope.row)">编辑
                  </el-button>
                  <el-button
                    size="small"
                    type="info"
                    icon="setting"
                    @click="handleRoleConfig(scope.$index, scope.row)">测试
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="tableData.pagination.pageNo"
              :page-sizes="[5, 10, 20]"
              :page-size="tableData.pagination.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableData.pagination.total">
            </el-pagination> -->


              <el-dialog
                title="数据源类型"
                :visible.sync="dialogVisible"
                width="30%"
              >
                
                <el-form ref="form" :model="jdform" label-width="60px">
                    <el-form-item label="名称">
                      <el-input v-model="jdform.code"></el-input>
                    </el-form-item>
                  
                    <el-form-item label="描述">
                      <el-input type="textarea" v-model="jdform.description"></el-input>
                    </el-form-item>

                    

                </el-form>

                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="onSJYLXSubmit" v-if="jdform.id==null" >新 增</el-button>
                  <el-button type="primary" @click="onSJYLXSubmit_edit" v-else>修 改</el-button>
                </span>
              </el-dialog>

              <div v-show='isShowMenu' class='menu'>
                  <div  v-for="item in menu" :key="item.value" @click="menuClick(item)">
                    {{item.name}}
                  </div>
              </div>


              <div  class='coordinate'>
                <div> {{this.x}},{{this.y}}</div>
                <br>  
              </div>


           

        
        </el-card>
      </el-col>
    </el-row>
  </imp-panel>

</template>
<script type="text/babel">

  import panel from "../../components/panel.vue"
  import selectTree from "../../components/selectTree.vue"
  import treeter from "../../components/treeter"
  import merge from 'element-ui/src/utils/merge';

  import * as api from "../../api"
  import * as sysApi from '../../services/sys';

  import http_sjygl from "../../common/http_sjygl";

    import d3 from "d3/d3.min.js";
    import drag from "d3-drag/dist/d3-drag.min.js";

  export default {
    mixins: [ treeter ],
    components: {
      'imp-panel': panel,
      'el-select-tree': selectTree
    },
    data(){
      // var _this=this;
      return {
         workFlow: {
            // nodes: {},
            //  links: {}
              nodes: {},
             links: {}
        },
        //用于存储到数据库和从数据库解析流程
        // workFlowData:null,
        workFlowData:{
          nodes: [{
            id:"",
            transform:"translate(113, 66)",
            name:"算法1",
            'data-id':"3",
            configurationData:{},//算法配置属性
          }],
          links: [{
            id:"",
            from:"",
            to:"",
            d:""
          }]
        },

        //默认属性
        node_default:[{
            // id:"1597991898404",
            // transform:"translate(113, 66)",
            // name:"算法1",
            // 'data-id':"3",
            // class:"node"
               id: "1597991898404",
                dataId: "3",
                x:113,
                y:66,
                text: "算法1",
        },{
            // id:"1597991900563",
            // transform:"translate(113, 66)",
            // name:"算法1",
            // 'data-id':"3",
            // class:"node"
               id: "1597991900563",
                dataId: "3",
                x:360,
                y:160,
                text: "算法1",
        }],
        link_default:[{
          id:"1597991909948",
          from:"1597991898404",
          to:"1597991900563",
          d:"M163,84 L360,178",
          // stroke:"#333",
          // 'stroke-width':"2px",
          // class:"cable",
          // start:"60, 23",
          // output:"1",
          // 'marker-end':"url(#arrowhead)",
          // input:"1",
          // end:"60, 23",
       
        }],
        //默认属性

        svg:null,
        dragData:null,

        dx :0,
        dy: 0,
        dragElem:null,

        // isStartLine:false,
        drawLine : false,

        isShowMenu:false,
        menu:[{
          name:"删除",value:'01'
        },{
          name:"添加连线",value:'02'
        },{
          name:"设置",value:'04'
        }],


        x:'',
        y:'',

        curTranslate:[],





















        selectIconDialog: false,
        formLabelWidth: '100px',
        defaultProps: {
          children: 'children',
          label: 'value',
          id: "id",
        },
        maxId: 7000000,
        menuTree: [],
        form: {
          id: null,
          name: '',
          sort: 0,
          icon: '',
          href: '',
          isShow: '',
          delivery: false,
          parentId: null,
          desc: ''
        },

        currentRow: {},
        dialogVisible: false,
        dialogLoading: false,
        defaultProps: {
          children: 'children',
          label: 'value',
          id: "id",
        },
        roleTree: [],
        listLoading: false,
        searchKey: '',
        typeId:'',
        tableData: {
          pagination: {
            total: 0,
            pageNo: 1,
            pageSize: 5,
            parentId: 0
          },
          rows: []
        },
        jdform:{
          code: null,
          description: "",
          parent: -1,
          id:-1,
        },

      }
    },
    methods: {
      //创建工程
      setProject(){
         //node 赋值事件
        this.node_default.forEach(element => {
              this.addNode_fromProject(element);
        });
     
       
        this.link_default.forEach(element => {
             this.addLink_fromProject(element);
        });
      



      },
      setSvgEvent(){
        var _this=this;
        // this.svg = d3.select("svg");
        d3.select("svg").on("dragover", () => {
                    d3.event.preventDefault();
                })
                .on("drop", () => {
                    // let p = this.getMovePath();
                    // this.addData(p[0], p[1]);
                    // this.createNodeAndLine();
                    this.drop();
                })
                .on("contextmenu", function(data, index) {
                  //handle right click
                  // alert(1)
                  console.log(data,index,this)

                  //stop showing browser menu
                  d3.event.preventDefault()
                  
                })
                .on("click", function() {
                    _this.isShowMenu=false;
                    // alert('点击了空白')
                    // //右键连线 右键添加连线时鼠标移动更新结束坐标
                    // console.log('右键连线结束');
                    // if(_this.activeLine!=null&&_this.drawLine){
                    //   //获取当前选中节点
                    //   //  _this.activeLine = null;
                      
                    //   _this.drawLine=false;
                      
                    // }

                    //获取当前坐标，查找所有矩形，如果坐标在矩形内，则结束画线，否则画线未成功，关闭画线状态
                    //  d3.selectAll('g.node')
                    var count=0;
                    if(_this.activeLine!=null&&_this.drawLine){
                        d3.selectAll('g.node').each(function(){
                          d3.select(this)
                          var transform =  d3.select(this).attr("transform");
                          var translate = _this.getTranslate(transform);
                          //点落点矩形中 count 替代break
                          if(count<=1&&translate[0]<=_this.x&&translate[1]<=_this.y&&(translate[0]+120)>=_this.x&&(translate[1]+36)>=_this.y){
                            
                      
                                //  alert('删除新建')
                                //删除那个默认的path，重新insert path;
                                _this.activeLine;
                                _this.curTranslate;
                                _this.currentNode;
                                  var lsnode=  _this.activeLine;
                                lsnode.attr("from");
                                // this; element
                                
                                var id=new Date().getTime();
                                var newpath= d3.select("svg")
                                  .insert("path","g")
                                  .attr("id", id)
                                  // .append("path")
                                  .attr("stroke", "#333")
                                  .attr("stroke-width", "2px")
                                  .attr("class", "cable")
                                  .attr("from",lsnode.attr("from"))
                                  .attr("start", 60 + ", " + 23)
                                  .attr("output",1)
                                  .attr("marker-end", "url(#arrowhead)")
                                  .attr("to",this.id)
                                  .attr("input",1)
                                  .attr("end", 60 + ", " + 23);

                                  d3.selectAll('path[id="' +  lsnode.attr("id")+ '"]').remove();
                                  //  d3.selectAll('g[id="' +  this. SelectedNode.id + '"]').remove();
                                  
                                  var endnode=d3.selectAll('g[id="' +  this.id + '"]');
                                  
                                  var transform = endnode.attr("transform");
                                  var endTranslate = _this.getTranslate(transform);
                                  //默认连接结束点的右侧
                                  newpath.attr("d", function() {
                                      return "M" +(_this.curTranslate[0]+60) + "," + (_this.curTranslate[1]+18)
                                      + " L" +(endTranslate[0]) + "," + (endTranslate[1]+18);
                                  });


                                  newpath.on("contextmenu", function(data, index) {
                                    //handle right click
                                    // alert(1)
                                    console.log(data,index,this)
                                    //显示弹出框，选中删除
                                    _this.isShowMenu=true;
                                    _this.menu=[{
                                      name:"删除",value:'03'
                                    }]
                                  
                                    document.querySelector('.menu').style.left=  d3.event.layerX+380+'px';
                                    document.querySelector('.menu').style.top=  d3.event.layerY+'px';
                                  
                                    _this.SelectedNode=this;
                                    //stop showing browser menu
                                    // d3.event.preventDefault()
                                  
                                  })

                                  _this.workFlow.links[id]=newpath;




                                  _this.activeLine=null;
                                  _this.drawLine=false;
                                
                            
                            
                                  count+=1;
                          
                          }
                    });

                 
                    if(count==0){
                      //没找到落到空白处 删除当临时画线 
                      var lsnode=  _this.activeLine;
                      d3.selectAll('path[id="' +  lsnode.attr("id")+ '"]').remove();
                      _this.activeLine = null;
                      _this.drawLine=false;
                    }
                 }
                 


                  
                })
                .on("mousemove", () => {
                  // if(_this.isStartLine){
                  //     console.log('连线移动');
                  // }
                  this.x=d3.event.layerX-20;
                  this.y=d3.event.layerY-20;

                  //右键连线 右键添加连线时鼠标移动更新结束坐标
                  console.log('右键连线移动');
                  if(_this.activeLine!=null&&_this.drawLine){
                      _this.activeLine.attr("d", function() {
                          return "M" +(_this.curTranslate[0]+60) + "," + (_this.curTranslate[1]+18)
                          + " L" + _this.x + "," + _this.y;
                      });
                  }

                  // //右键连线 点击空白结束
                  // if(_this.activeLine!=null&&_this.drawLine==false){
                    
                  //     // alert('删除');
                  //        var lsnode=  _this.activeLine;
                  //       d3.selectAll('path[id="' +  lsnode.attr("id")+ '"]').remove();
                  //         _this.activeLine=null;
                  // }
                

                 
                   
                });



      },

      menuClick(item){
        this.isShowMenu=false;
         switch (item.value) {
                case "01":
                    //节点删除
                    //删除节点要删除关联的连线
                    alert('确认删除？');
                    this.deleteNodes();
                    break;
                case "02":
                    //节点添加连线
                    // this.addLink_Manual(item);
                    this.addLink_Manual();
                    // console.log(1);
                    break;
                case "03":
                    //连线删除
                    this.deleteLink();
                    break;
                case "04":
                  //节点设置
                  this.setNode();
                  break;
            }  
      },
      deleteNodes(){
        this.SelectedNode;
        this. SelectedNode.id;
         d3.selectAll('path[from="' +  this. SelectedNode.id + '"]').remove();
         d3.selectAll('path[to="' +  this. SelectedNode.id + '"]').remove();
         d3.selectAll('g[id="' +  this. SelectedNode.id + '"]').remove();
      },
      deleteLink(){
        this.SelectedNode;
        this. SelectedNode.id;
         d3.selectAll('path[id="' +  this. SelectedNode.id + '"]').remove();
      },
      addLink_Manual(){
        var _this=this;
        //当前节点的中心点为起点, 画布onmousemove  事件 移动 添加结束点  画布拖拽结束事件 清空 线 
        this.SelectedNode;
        this. SelectedNode.id;
        var node=d3.selectAll('g[id="' +  this. SelectedNode.id + '"]')


        console.log("右键连线拖拽状态：开始",node,this);
        this.x;

        this.drawLine = true;




        // // 当前选中的circle
        // var anchor = d3.select(this);
        // // 当前选中的节点
        // var node = d3.select(this.parentNode);
        // var rect = node.node().getBoundingClientRect();
        // var dx = rect.width / (+anchor.attr("output") + 1);
        // var dy = rect.height/2;
        var transform = node.attr("transform");
        this.curTranslate = this.getTranslate(transform);
        var points=[];
        points.push([ this.curTranslate[0],this.curTranslate[1]]);
        points.push([  this.x, this.y]);
      

        // this.activeLine  vue 组件data追加的数据 不具备响应式功能
          //用insert 添加到当前开始节点的前面
        this.activeLine = d3.select("svg")
          // .insert("path","g")
          .append("path")
          .attr("id", new Date().getTime())
          .attr("stroke", "#333")
          // .attr("stroke", "red")
          .attr("stroke-width", "2px")
          .attr("class", "cable")
          .attr("from", node.attr("id"))
          // .attr("start", dx + ", " + dy)
          // .attr("output", d3.select(this).attr("output"))
          .attr("marker-end", "url(#arrowhead)");

        this.activeLine.attr("d", function() {
            console.log(2, points[1][0]);
            return "M" +(_this.curTranslate[0]+60) + "," + (_this.curTranslate[1]+18)
            + " L" + _this.x + "," + _this.y;
        });

        // this.activeLine=null;
        //  this.drawLine = false;



      






      },
      addNode_fromProject(node) {
        var _this=this;
        var dragelem
          var g = d3.select("svg").append("g")
                    .attr("class", "node")
                    .attr("data-id", node.dataId)
                    .attr("id", node.id)
                    .attr("transform", 'translate(' + node.x + ', ' + node.y + ')');

          var rect = g.append("rect")
            .attr("width", 120)
            .attr("height", 36)
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("stroke-width", 2)
            .attr("stroke", "#333")
            .attr("fill", "#fff");

          var bound = rect.node().getBoundingClientRect();
          var width = bound.width;
          var height = bound.height;

          // text
          g.append("text")
          .text(node.text)
          .attr("x", width / 2)
          .attr("y", height / 2)
          .attr("dominant-baseline", "central") 
          .attr("text-anchor", "middle");

          // left icon
          g.append('text')
          .attr("x", 18)
          .attr("y", height / 2)
          .attr("dominant-baseline", "central") 
          .attr("text-anchor", "middle")
          .attr('font-family', 'FontAwesome')
              .text('\uf1c0');

          // right icon
          g.append('text')
          .attr("x", width - 18)
          .attr("y", height / 2)
          .attr("dominant-baseline", "central") 
          .attr("text-anchor", "middle")
          .attr('font-family', 'FontAwesome')
              .text('\uf00c');

          g.on("contextmenu", function(data, index) {
                  //handle right click
                  // alert(1)
                  console.log(data,index,this)
                  //显示弹出框，选中删除
                  _this.isShowMenu=true;
                    _this.menu=[{
                    name:"删除",value:'01'
                  },{
                    name:"添加连线",value:'02'
                  },{
                    name:"设置",value:'04'
                  }]
                  document.querySelector('.menu').style.left=  d3.event.layerX+450+'px';
                  document.querySelector('.menu').style.top=  d3.event.layerY+'px';
                
                  _this.SelectedNode=this;
                  //stop showing browser menu
                  d3.event.preventDefault()
                
            });
         

            g.call(
                d3.behavior.drag()
                  // .on("dragstart", this.dragstarted)
                  // .on("drag", this.dragged)
                  // .on("dragend", this.dragended)
                  .on("dragstart",function(d,i){
                    _this.isShowMenu=false;
                    console.log("节点拖拽状态：开始",d,i);
                    console.log(this);
                    var transform = d3.select(this).attr("transform");
                    var translate = _this.getTranslate(transform);
                    _this.dx = d3.event.sourceEvent.layerX - translate[0];
                    _this.dy = d3.event.sourceEvent.layerY - translate[1];
                    dragelem = d3.select(this);
                  })
                  .on("dragend",function(d,i){
                    console.log("节点拖拽状态：结束",d,i);
                      _this.dx = _this.dy = 0;
                      dragelem = null;
                  })
                  .on("drag",function(d,i){
                    console.log("节点拖拽状态：进行中",this);
                    dragelem.attr("transform", "translate(" + ( d3.event.sourceEvent.layerX - _this.dx) + ", " + ( d3.event.sourceEvent.layerY - _this.dy) + ")");
                    _this.updateCable(dragelem);

                  })
                 
                 
            );


         
      },

      addLink_fromProject(link){
          var _this=this;
          var path= d3.select("svg")
          .insert("path","g")
          .attr("id", link.id)
          // .append("path")
          .attr("stroke", "#333")
          .attr("stroke-width", "2px")
          .attr("class", "cable")
          .attr("from",link.from)
          .attr("start", 60 + ", " + 23)
          .attr("output",1)
          .attr("marker-end", "url(#arrowhead)")
          .attr("to",link.to)
          .attr("input",1)
          .attr("end", 60 + ", " + 23)
          .attr("d",link.d);



          path.on("contextmenu", function(data, index) {
            //handle right click
            // alert(1)
            console.log(data,index,this)
            //显示弹出框，选中删除
            _this.isShowMenu=true;
            _this.menu=[{
              name:"删除",value:'03'
            }]
          
            document.querySelector('.menu').style.left=  d3.event.layerX+380+'px';
            document.querySelector('.menu').style.top=  d3.event.layerY+'px';
          
            _this.SelectedNode=this;
            //stop showing browser menu
            // d3.event.preventDefault()
          
          })

         
      },


      setNode(){
        //设置弹框
        this.dialogVisible=true;
      },
      


      dragStart(node){
         console.log('拖动node',node);
         this.dragData = node;
        


      },

      drop(){
        var _this=this;
         //节点拖拽相关变量
        var dragelem=null;


        //连线拖拽相关变量
        var activeLine = null;
        var points = [];
        var translate = null;
        // var drawLine = false;
         var node = {
                id: new Date().getTime(),
                dataId:  this.dragData.id,
                x:d3.event.layerX|| 250,
                y:d3.event.layerY|| 40,
                text: this.dragData.data.value,
                // inputs: 1,
                // outputs: 2
            };

            // if(node.dataId == 101) {
            //     node.inputs = 0;
            //     node.outputs = 1;
            // } else if(node.dataId == 102) {
            //     node.inputs = 1;
            //     node.outputs = 0;
            // } else {
            //     node.inputs = 1;
            //     node.outputs = 1;
            // }
            // 计算节点编号
            // if(this.workFlow.nodes[node.dataId]) {
            //     this.workFlow.nodes[node.dataId] += 1;
            // } else {
            //     this.workFlow.nodes[node.dataId] = 1;
            // }
            var g = this.addNode( node);
            this.workFlow.nodes[node.id]=g;
            g.on("contextmenu", function(data, index) {
                  //handle right click
                  // alert(1)
                  console.log(data,index,this)
                  //显示弹出框，选中删除
                  _this.isShowMenu=true;
                    _this.menu=[{
                    name:"删除",value:'01'
                  },{
                    name:"添加连线",value:'02'
                  },{
                    name:"设置",value:'04'
                  }]
                  document.querySelector('.menu').style.left=  d3.event.layerX+450+'px';
                  document.querySelector('.menu').style.top=  d3.event.layerY+'px';
                
                  _this.SelectedNode=this;
                  //stop showing browser menu
                  d3.event.preventDefault()
                
            });
            // g.on("click", function() {
            //     // _this.drawLine=false;
            //     //   _this.activeLine=null;

            //     // alert('点击了矩形')
            //     //右键连线 点击了相当于结束 然后在范围内
            //       // alert(_this.drawLine)
            //     if(_this.activeLine!=null&&_this.drawLine){
                    
            //         //  alert('删除新建')
            //         //删除那个默认的path，重新insert path;
            //         _this.activeLine;
            //         _this.curTranslate;
            //         _this.currentNode;
            //           var lsnode=  _this.activeLine;
            //         lsnode.attr("from");
            //         this;
                    
            //         var id=new Date().getTime();
            //         var newpath= d3.select("svg")
            //           .insert("path","g")
            //           .attr("id", id)
            //           // .append("path")
            //           .attr("stroke", "#333")
            //           .attr("stroke-width", "2px")
            //           .attr("class", "cable")
            //           .attr("from",lsnode.attr("from"))
            //           .attr("start", 60 + ", " + 23)
            //           .attr("output",1)
            //           .attr("marker-end", "url(#arrowhead)")
            //           .attr("to",this.id)
            //           .attr("input",1)
            //           .attr("end", 60 + ", " + 23);

            //           d3.selectAll('path[id="' +  lsnode.attr("id")+ '"]').remove();
            //           //  d3.selectAll('g[id="' +  this. SelectedNode.id + '"]').remove();
                      
            //           var endnode=d3.selectAll('g[id="' +  this.id + '"]');
                      
            //           var transform = endnode.attr("transform");
            //           var endTranslate = _this.getTranslate(transform);
            //           //默认连接结束点的右侧
            //           newpath.attr("d", function() {
            //               return "M" +(_this.curTranslate[0]+60) + "," + (_this.curTranslate[1]+18)
            //               + " L" +(endTranslate[0]) + "," + (endTranslate[1]+18);
            //           });


            //           newpath.on("contextmenu", function(data, index) {
            //             //handle right click
            //             // alert(1)
            //             console.log(data,index,this)
            //             //显示弹出框，选中删除
            //             _this.isShowMenu=true;
            //             _this.menu=[{
            //               name:"删除",value:'03'
            //             }]
                      
            //             document.querySelector('.menu').style.left=  d3.event.layerX+580+'px';
            //             document.querySelector('.menu').style.top=  d3.event.layerY+'px';
                      
            //             _this.SelectedNode=this;
            //             //stop showing browser menu
            //             // d3.event.preventDefault()
                      
            //           })

            //           _this.workFlow.links[id]=newpath;




            //           _this.activeLine=null;
            //               _this.drawLine=false;
                    
            //     }
            //         //  d3.event.sourceEvent.stopPropagation();
              

            //           d3.event.stopPropagation();
                    
            
                
                
            // });


            g.call(
                d3.behavior.drag()
                  // .on("dragstart", this.dragstarted)
                  // .on("drag", this.dragged)
                  // .on("dragend", this.dragended)
                  .on("dragstart",function(d,i){
                    _this.isShowMenu=false;
                    console.log("节点拖拽状态：开始",d,i);
                    console.log(this);
                    var transform = d3.select(this).attr("transform");
                    var translate = _this.getTranslate(transform);
                    _this.dx = d3.event.sourceEvent.layerX - translate[0];
                    _this.dy = d3.event.sourceEvent.layerY - translate[1];
                    dragelem = d3.select(this);
                  })
                  .on("dragend",function(d,i){
                    console.log("节点拖拽状态：结束",d,i);
                      _this.dx = _this.dy = 0;
                      dragelem = null;
                  })
                  .on("drag",function(d,i){
                    console.log("节点拖拽状态：进行中",this);
                    dragelem.attr("transform", "translate(" + ( d3.event.sourceEvent.layerX - _this.dx) + ", " + ( d3.event.sourceEvent.layerY - _this.dy) + ")");
                    _this.updateCable(dragelem);

                  })
                 
                 
            );

  
          
            // g.selectAll("circle.output").call(
            //     d3.behavior.drag()
            //       .on("dragstart", function(d,i){
            //         console.log("连线拖拽状态：开始",d,i);
            //         console.log(this);
            //          d3.event.sourceEvent.stopPropagation();


            //         _this.drawLine = false;
            //         // 当前选中的circle
            //         var anchor = d3.select(this);
            //         // 当前选中的节点
            //         var node = d3.select(this.parentNode);
            //         var rect = node.node().getBoundingClientRect();
            //         var dx = rect.width / (+anchor.attr("output") + 1);
            //         var dy = rect.height/2;
            //         var transform = node.attr("transform");
            //         translate = _this.getTranslate(transform);
            //         points.push([dx + translate[0], dy + translate[1]]);
            //         // activeLine = d3.select("svg")
            //         //   .append("path")
            //         //     .attr("stroke", "#333")
            //         //     .attr("stroke-width", "2px")
            //         //   .attr("class", "cable")
            //         //   .attr("from", node.attr("id"))
            //         //   .attr("start", dx + ", " + dy)
            //         //   .attr("output", d3.select(this).attr("output"))
            //         //   .attr("marker-end", "url(#arrowhead)");

            //           //用insert 添加到当前开始节点的前面

            //            activeLine = d3.select("svg")
            //            .insert("path","g")
            //               .attr("id", new Date().getTime())
            //           // .append("path")
            //             .attr("stroke", "#333")
            //             .attr("stroke-width", "2px")
            //           .attr("class", "cable")
            //           .attr("from", node.attr("id"))
            //           .attr("start", dx + ", " + dy)
            //           .attr("output", d3.select(this).attr("output"))
            //           .attr("marker-end", "url(#arrowhead)");


            //           activeLine.on("contextmenu", function(data, index) {
            //             //handle right click
            //             // alert(1)
            //             console.log(data,index,this)
            //             //显示弹出框，选中删除
            //             _this.isShowMenu=true;
            //             _this.menu=[{
            //               name:"删除",value:'03'
            //             }]
                      
            //             document.querySelector('.menu').style.left=  d3.event.layerX+380+'px';
            //             document.querySelector('.menu').style.top=  d3.event.layerY+'px';
                      
            //             _this.SelectedNode=this;
            //             //stop showing browser menu
            //             d3.event.preventDefault()
                      
            //           })



            //       })
            //       .on("drag", function(d,i){
            //         console.log("连线拖拽状态：进行中",d,i);
                   
            //         console.log(this);
            //           _this.drawLine = true;
            //           console.log('是否正在画线',_this.drawLine);
            //           points[1] = [d3.event.x + translate[0], d3.event.y + translate[1]];
                    
            //           activeLine.attr("d", function() {
                          

            //               console.log(2, points[1][0]);
            //               return "M" + points[0][0] + "," + points[0][1]
            //               + " L" +  points[1][0] + "," + points[1][1];
            //           });


            //       })
            //       .on("dragend", function(d,i){
            //         console.log("连线拖拽状态：结束",d,i);
            //         console.log(this);
            //           d3.event.sourceEvent.stopPropagation();

            //         _this.drawLine = false;
            //         var anchor = d3.selectAll("circle.end");
            //         if(anchor.empty()) {
            //             activeLine.remove();
            //         } else {
            //             var pNode = d3.select(anchor.node().parentNode);
            //             var input = pNode.node().getBoundingClientRect().width / (+anchor.attr("input") + 1);
            //             anchor.classed("end", false);
            //             activeLine.attr("to", pNode.attr("id"));
            //             activeLine.attr("input", anchor.attr("input"));
            //             activeLine.attr("end", input + ", 0");

            //               // //连线成功之后把from 节点放到path节点后，解决svg 中后生成的线会压盖先生成的节点
            //               // //还要重新赋值事件
            //               // //  var starnode= d3.selectAll('g[id="' + activeLine.attr("from") + '"]');
            //               // var starnode=  document.querySelector('g[id="' + activeLine.attr("from") + '"]');
            //               // var copy=starnode.cloneNode(true);
            //               // //  starnode=null;
            //               //   document.querySelector('svg').removeChild(starnode);
            //               //   document.querySelector('svg').appendChild(copy);
            //         }
            //         activeLine = null;
            //         points.length = 0;
            //         translate = null;


                  






            //       })
            // );

            // g.selectAll("circle.input")
            //  .on("mouseover", function() {
            //     console.log('进入范围',_this.drawLine);
            //     if(_this.drawLine) {
            //         d3.selectAll("circle.end").classed("end", false);
            //         d3.select(this).classed("end", true);
            //     }
            // });

         

      },

  
      addNode(node) {
          var g = d3.select("svg").append("g")
                    .attr("class", "node")
                    .attr("data-id", node.dataId)
                    .attr("id", node.id)
                    .attr("transform", 'translate(' + node.x + ', ' + node.y + ')');

          var rect = g.append("rect")
           .attr("width", 120)
            .attr("height", 36)
          .attr("rx", 5)
          .attr("ry", 5)
          .attr("stroke-width", 2)
          .attr("stroke", "#333")
          .attr("fill", "#fff");

          var bound = rect.node().getBoundingClientRect();
          var width = bound.width;
          var height = bound.height;

          // text
          g.append("text")
          .text(node.text)
          .attr("x", width / 2)
          .attr("y", height / 2)
          .attr("dominant-baseline", "central") 
          .attr("text-anchor", "middle");

          // left icon
          g.append('text')
          .attr("x", 18)
          .attr("y", height / 2)
          .attr("dominant-baseline", "central") 
          .attr("text-anchor", "middle")
          .attr('font-family', 'FontAwesome')
              .text('\uf1c0');

          // right icon
          g.append('text')
          .attr("x", width - 18)
          .attr("y", height / 2)
          .attr("dominant-baseline", "central") 
          .attr("text-anchor", "middle")
          .attr('font-family', 'FontAwesome')
              .text('\uf00c');

          // // input circle
          // var inputs = node.inputs || 0;
          // g.attr("inputs", inputs);
          // for(var i = 0; i < inputs; i++) {
          //     g.append("circle")
          //     .attr("class", "input")
          //     .attr("input", (i + 1))
          //     .attr("cx", width * (i + 1) / (inputs + 1))
          //     .attr("cy", 0)
          //     .attr("r", 5);
          // }

          // // output circle
          // var outputs = node.outputs || 0;
          // g.attr("outputs", outputs);
          // for(i = 0; i < outputs; i++) {
          //     g.append("circle")
          //     .attr("output", (i + 1))
          //     .attr("class", "output")
          //     .attr("cx", width * (i + 1) / (outputs + 1))
          //     .attr("cy", height)
          //     .attr("r", 5);
          // }

          return g;
      },

    

      getTranslate(transform) {
          var arr = transform.substring(transform.indexOf("(")+1, transform.indexOf(")")).split(",");
          return [+arr[0], +arr[1]];
      },

      // dragstarted() {
      //     console.log(this);
      //     var transform = d3.select(this).attr("transform");
      //     var translate = getTranslate(transform);
      //     this.dx = d3.event.x - translate[0];
      //     this.dy = d3.event.y - translate[1];
      //     this.dragElem = d3.select(this);
      // },

      // dragged() {
      //   this.dragElem.attr("transform", "translate(" + (d3.event.x - this.dx) + ", " + (d3.event.y - this.dy) + ")");
      //   this.updateCable(this.dragElem);
      // },

      updateCable(elem) {
          var bound = elem.node().getBoundingClientRect();
          var width = bound.width;
          var height = bound.height;
          var id = elem.attr("id");
          var transform = elem.attr("transform");
          var t1 = this.getTranslate(transform);

          var _this=this;
          // 更新输出线的位置
          d3.selectAll('path[from="' + id + '"]')
            .each(function() {
              var start = d3.select(this).attr("start").split(",");
              start[0] = +start[0] + t1[0];
              start[1] = +start[1] + t1[1];

              var path = d3.select(this).attr("d");
              // var end = path.substring(path.lastIndexOf(" ") + 1).split(",");
              var end = path.substring(path.lastIndexOf(" ") + 2).split(",");
              end[0] = +end[0];
              end[1] = +end[1];

              // d3.select(this).attr("d", function() {
              //     return "M" + start[0] + "," + start[1]
              //     + " C" + start[0] + "," + (start[1] + end[1]) / 2
              //     + " " + end[0] + "," +  (start[1] + end[1]) / 2
              //     + " " + end[0] + "," + end[1];
              // });
              console.log(3,path),
              console.log(3,end[0]),
              d3.select(this).attr("d", function() {
                  return "M" + start[0] + "," + start[1]
                  + " L" +  end[0] + "," + end[1];
              });

              //输出那个节点在输入节点的方位不同时，连接输入节点的四个不同方向（或者连接输入节点外框边缘）
              //矩形 120 36+10       (x,y)  中心点  输入点(start[0],start[1])     左下角坐标 (start[0]-60,start[1]-18)  
              //矩形 120 36+10      左上角坐标 a(endnode_t1[0],endnode_t1[1])    右下角坐标b(end[0]+120,end[1]+36) 
              //井字形
              //点到矩形的最近的点
              //正上
              //输出点不动 start 值固定 求end的值
             
              var endnodeid=d3.select(this).attr('to');
                 var endnode=    d3.selectAll('g[id="' + endnodeid + '"]');
                  var endnode_tansform = endnode.attr("transform");
               var endnode_t1 = _this.getTranslate(endnode_tansform);//左上角坐标

         
              //正上
              if(start[1]<endnode_t1[1]){
                  d3.select(this).attr("d", function() {
                    return "M" + start[0] + "," + start[1]
                    + " L" + (endnode_t1[0]+60)  + "," + (endnode_t1[1]);
                  });
              }
               //左
              if(start[0]<=endnode_t1[0]&&endnode_t1[1]<=start[1]&&start[1]<=endnode_t1[1]+36){
                  d3.select(this).attr("d", function() {
                      return "M" + start[0] + "," + start[1]
                      + " L" +  (endnode_t1[0]) + "," +(endnode_t1[1]+18) ;
                  });
              }
              //正下
              if(start[1]>endnode_t1[1]+36){
                  d3.select(this).attr("d", function() {
                      return "M" + start[0] + "," + start[1]
                      + " L" + (endnode_t1[0]+60)  + "," + (endnode_t1[1]+36);
                  });
              }
             
              //右
               if(start[0]>=endnode_t1[0]+60&&endnode_t1[1]<=start[1]&&start[1]<=endnode_t1[1]+36){
                  d3.select(this).attr("d", function() {
                      return "M" + start[0] + "," + start[1]
                      + " L" +  (endnode_t1[0]+120)+ "," +( endnode_t1[1]+18);
                  });
              }

            });

          // 更新输入线的位置
          d3.selectAll('path[to="' + id + '"]')
            .each(function() {
              var path = d3.select(this).attr("d");
              // var start = path.substring(1, path.indexOf("C")).split(",");
              var start = path.substring(1, path.indexOf("L")).split(",");
              start[0] = +start[0];
              start[1] = +start[1];

              var end = d3.select(this).attr("end").split(",");
              end[0] = +end[0] + t1[0];
              end[1] = +end[1] + t1[1];

              // d3.select(this).attr("d", function() {
              //     return "M" + start[0] + "," + start[1]
              //     + " C" + start[0] + "," + (start[1] + end[1]) / 2
              //     + " " + end[0] + "," +  (start[1] + end[1]) / 2
              //     + " " + end[0] + "," + end[1];
              // });
              console.log(4,end[0]),
              d3.select(this).attr("d", function() {
                  return "M" + start[0] + "," + start[1]
                  + " L" +  end[0] + "," + end[1];
              });

              //输出那个节点在输入节点的方位不同时，连接输入节点的四个不同方向（或者连接输入节点外框边缘）
              //矩形 120 36+10       (x,y)  中心点  输入点(startnode_t1[0]+60,startnode_t1[1]+18)    
              //矩形 120 36+10      左上角坐标 a(endnode_t1[0],endnode_t1[1])    右下角坐标b(endnode_t1[0]+120,endnode_t1[1]+36)  
              //井字形
              //点到矩形的最近的点
              //正上
              //输入点不动 end 值固定 求start的值
             
              var startnodeid=d3.select(this).attr('from');
                 var startnode=    d3.selectAll('g[id="' + startnodeid + '"]');
                  var startnode_tansform = startnode.attr("transform");
               var startnode_t1 = _this.getTranslate(startnode_tansform);//左上角坐标

                var endnodeid=d3.select(this).attr('to');
                 var endnode=    d3.selectAll('g[id="' + endnodeid + '"]');
                  var endnode_tansform = endnode.attr("transform");
               var endnode_t1 = _this.getTranslate(endnode_tansform);//左上角坐标

         
              //正上
              if(startnode_t1[1]+18<endnode_t1[1]){
                  d3.select(this).attr("d", function() {
                    return "M" + (startnode_t1[0]+60) + "," + (startnode_t1[1]+18)
                    + " L" + (endnode_t1[0]+60)  + "," + (endnode_t1[1]);
                  });
              }
               //左
              if(startnode_t1[0]+60<=endnode_t1[0]&&endnode_t1[1]<=startnode_t1[1]+18&&startnode_t1[1]+18<=endnode_t1[1]+36){
                  d3.select(this).attr("d", function() {
                      return "M" +  (startnode_t1[0]+60) + "," + (startnode_t1[1]+18)
                      + " L" +  (endnode_t1[0]) + "," +(endnode_t1[1]+18) ;
                  });
              }
              //正下
              if(startnode_t1[1]+18>endnode_t1[1]+36){
                  d3.select(this).attr("d", function() {
                      return "M" +  (startnode_t1[0]+60) + "," + (startnode_t1[1]+18)
                       + " L" + (endnode_t1[0]+60)  + "," + (endnode_t1[1]+36);
                  });
              }
             
              //右
               if(startnode_t1[0]+60>=end[0]+60&&endnode_t1[1]<=startnode_t1[1]+18&&startnode_t1[1]+18<=endnode_t1[1]+36){
                  d3.select(this).attr("d", function() {
                      return "M" + (startnode_t1[0]+60) + "," +(startnode_t1[1]+18)
                        + " L" +  (endnode_t1[0]+120)+ "," +( endnode_t1[1]+18);
                  });
              }




          });




      },

      // dragended() {
      //     this.dx = this.dy = 0;
      //     this.dragElem = null;
      // },








      
      btnSave(){
        var _this=this;
        console.log(this.workFlow);
        this.workFlow;
        //workFlow 生成 存入数据库 的 workFlowData
        this.workFlow.nodes;
        this.workFlow.links;
        Object.keys(this.workFlow.nodes);
        Object.keys(this.workFlow.links);
        Object.keys(this.workFlow.nodes).forEach(element => {
          _this.workFlow.nodes[element]
          _this.workFlow.nodes[element].attr('id')
          _this.workFlow.nodes[element].attr('transform');
          _this.workFlow.nodes[element].attr('data-id');
          _this.workFlow.nodes[element].select('text').text();
        });
        Object.keys(this.workFlow.links).forEach(element => {
            _this.workFlow.links[element];
            _this.workFlow.links[element].attr('id');
            _this.workFlow.links[element].attr('from');
            _this.workFlow.links[element].attr('to');
            _this.workFlow.links[element].attr('d');
        });

      },
      btnPublish(){},
      btnRun(){},
      btnClose(){},

      //
      setWorkFlow(){
        this.workFlowData;
      },
















      btnReset(){
        // this.$router.push({path:''});
          // this.$router.push({path: 'sjygl'})
          this.searchKey='';
          this.typeId=0;
          this.load();
             this.loadData();
      },




      onSJYLXSubmit(data) {
        //  this.jdform.code='';
        //  this.jdform.description='';
        
        
         return http_sjygl
              .addSJYLX(this.jdform)
              .then(res => res)
              .then(data => {
                  if(data.data.code==200)
                  {  
                     this.$message(data.data.msg);
                     this.load();
                     this.dialogVisible=false;
                     this.$refs.menuTree.currentNode=null
                
                  }else{
                    this.$message(data.data.msg);
                  }
              }).catch(e => {  this.$message('接口操作失败');})


      },

      onSJYLXSubmit_edit(){
         return http_sjygl
              .updateSJYLXbyID(this.jdform)
              .then(res => res)
              .then(data => {
                  if(data.data.code==200)
                  {    this.$message(data.data.msg);
                    this.load();
                     this.dialogVisible=false;
                     this.$refs.menuTree.currentNode=null

                
                  }else{
                    this.$message(data.data.msg);
                  }
              }).catch(e => {  this.$message('接口操作失败');})
      },

     

      selectIcon(event){
        this.form.icon = event.target.className;
        this.selectIconDialog = false;
      },
      renderContent(h, { node, data, store }) {
        return (
          // <span>
          //   <span>
          //     <span><i class={data.icon}></i>&nbsp;{node.label}</span>
          //   </span>
          // </span>
          //  <i class='el-icon-menu'></i>  el-icon-folder
          <span class="custom-tree-node">
           
            <i class={node.childNodes.length!=0?'el-icon-folder':'el-icon-tickets'}></i>

          
            <span >
               <span draggable={node.childNodes.length!=0?'false':'true'}  on-dragstart={ () => this.dragStart(node) } > {node.label} </span>
                
            </span>



          </span>
          );
      },
      addsjylx(){


        if(this.$refs.menuTree.currentNode==null){ this.$message('请选择一个节点进行添加');return;}
                 this.dialogVisible=true;
                
                 var data= this.$refs.menuTree.currentNode.node.data;
                   console.log(data);
                  console.log(data.id);

                  this.jdform.parent=parseInt(data.id);

                     this.jdform.id=null;
                   
                    this.jdform.code=null;
                    this.jdform.description='';
      },
      updatesjylx(){
        if(this.$refs.menuTree.currentNode==null){ this.$message('请选择一个节点进行修改');return;}
          
          this.dialogVisible=true;
            var data= this.$refs.menuTree.currentNode.node.data;
                  console.log(data);
                  console.log(data.id);
                  
                    this.jdform.id=parseInt(data.id);
                    this.jdform.parent=parseInt(data.parentId);
                    this.jdform.code=data.value;
                    this.jdform.description=data.payload.description;

      },

      deletesjylx(){

        if(this.$refs.menuTree.currentNode==null){ this.$message('请选择一个节点进行删除');return;}
          
                  // console.log(node);
                  //   console.log(data);
                  //    console.log(store);
                    var data= this.$refs.menuTree.currentNode.node.data;
                  //判断该节点下是否有数据，有则不能删除
                  if(data.children.length>0){
                    this.$message('请先删除子节点');
                    return;
                  }
                   if(data.children.length>0){
                    this.$message('请先删除子节点');
                    return;
                  }

                  this.$confirm('将删除该数据, 是否确定?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                  }).then(() => {
                
                  
                  
                    return http_sjygl
                      .deleteSJYLXbyID({id:data.id})
                      .then(res => res)
                      .then(data => {
                          if(data.data.code==200)
                          {
                            this.load();
                            this.$refs.menuTree.currentNode=null
                            this.$message(data.data.msg);
                        
                          }else{
                            this.$message(data.data.msg);
                          }
                      }).catch(e => {  this.$message('接口操作失败');})


                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消删除'
                    });
                  });







      },

      newAdd(){
        this.form = {
          id: null,
          name: '',
          sort: 0,
          icon: '',
          href: '',
          isShow: '',
          delivery: false,
          parentId: null,
          desc: ''
        };
      },
      deleteSelected(){
        this.$http.get(api.SYS_MENU_DELETE + "?menuIds=" + this.form.id)
          .then(res => {
            this.$message('操作成功');
            this.deleteFromTree(this.menuTree, this.form.id);
            this.newAdd();
          }).catch(e => {
          this.$message('操作成功');
          this.deleteFromTree(this.menuTree, this.form.id);
          this.newAdd();
        })
      },
      batchDelete(){
        var checkKeys = this.$refs.menuTree.getCheckedKeys();
        if (checkKeys == null || checkKeys.length <= 0) {
          this.$message.warning('请选择要删除的资源');
          return;
        }
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get(api.SYS_MENU_DELETE + "?menuIds=" + checkKeys.join(','))
            .then(res => {
              this.$message('操作成功');
              this.load();
            }).catch(e => {
            this.$message('操作成功');
            this.batchDeleteFromTree(this.menuTree, checkKeys);
          })
        });

      },
      handleNodeClick(data){
        console.log(1);
        console.log(data.value);
        //触发查询事件
        // this.searchKey=data.id;
        this.typeId=data.id;
        this.loadData();

        this.form = merge({}, data);
      },
      onSubmit(){
        if (this.form.id == null) {
          this.$http.post(api.SYS_MENU_ADD, this.form)
            .then(res => {
              this.$message('操作成功');
              this.form.id = res.data.id;
              this.appendTreeNode(this.menuTree, res.data);
            }).catch(e => {
            this.maxId += 1;
            this.$message('操作成功');
            this.form.id = this.maxId;
            var ddd = {
              id: this.form.id,
              name: this.form.name,
              sort: this.form.sort,
              icon: this.form.icon,
              href: this.form.href,
              isShow: this.form.isShow,
              delivery: this.form.delivery,
              parentId: this.form.parentId,
              desc: this.form.desc,
              children: []
            }
            this.appendTreeNode(this.menuTree, ddd);
            this.menuTree.push({});
            this.menuTree.pop();
          })
        } else {
          this.$http.post(api.SYS_MENU_UPDATE, this.form)
            .then(res => {
              this.$message('操作成功');
              this.updateTreeNode(this.menuTree, res.data);
            }).catch(e => {
            this.$message('操作成功');
            this.updateTreeNode(this.menuTree, merge({}, this.form));
          })
        }
      },
      load(){
        // sysApi.menuList().then(res => {
        //   this.menuTree = res;
        // })

        //  return http_sjygl
        //   .getSJYLXTREE({id:0})
        //   .then(res => res)
        //   .then(data => {
        //       if(data.data.code==200)
        //       {
        //           this.menuTree = data.data.data;
            
        //       }else{
        //          this.$message(data.data.msg);
        //       }
        //   }).catch(e => { 
        //       this.$message('接口操作失败');
            
        //     })

          this.menuTree = [
                        {
                          value: '一级 1',
                          children: [{
                            value: '二级 1-1',
                            children: [{
                              value: '算法1',
                              name:"",
                              type:'',
                              data:'',
                            },{
                              value: '算法3',
                                  name:"",
                              type:'',
                              data:'',
                            },{
                              value: '算法3',
                                  name:"",
                              type:'',
                              data:'',
                            },]
                          }]
                        }, {
                          value: '一级 2',
                          children: [{
                            value: '二级 2-1',
                            children: [{
                              value: '三级 2-1-1'
                            }]
                          }, {
                            value: '二级 2-2',
                            children: [{
                              value: '三级 2-2-1'
                            }]
                          }]
                        }, {
                          value: '一级 3',
                          children: [{
                            value: '二级 3-1',
                            children: [{
                              value: '三级 3-1-1'
                            }]
                          }, {
                            value: '二级 3-2',
                            children: [{
                              value: '三级 3-2-1'
                            }]
                          }]
              }];




      },



      search(target){
        this.loadData();
      },
      handleSelectionChange(val){

      },
      handleRoleConfig(index, row){
        console.log(row);
        var data={
          "dbName": row.dbName,
          "hostName": row.hostName,
          "password": row.password,
          "port": row.port,
          "username":row.username
        }
         switch (row.dbType) {
              case "mysql":
                  return http_sjygl
                    .testMysqlDbConnection(data)
                    .then(res => res)
                    .then(data => {
                        if(data.data.code==200)
                        {
                         this.$message(data.data.data);
                      
                        }else{
                          this.$message(data.data.msg);
                        }
                    }).catch(e => {  this.$message('接口操作失败');})


                break;
              case "oracle":
                  return http_sjygl
                    .testOracleDbConnection(data)
                    .then(res => res)
                    .then(data => {
                        if(data.data.code==200)
                        {
                         this.$message(data.data.data);
                      
                        }else{
                          this.$message(data.data.msg);
                        }
                    }).catch(e => {  this.$message('接口操作失败');})

                break;
            }  

        dbType
        // this.currentRow = row;
        // this.dialogVisible = true;
        // if (this.roleTree.length <= 0) {
        //   sysApi.roleList({selectChildren:true})
        //     .then(res => {
        //       this.roleTree = res
        //     })
        // }
        // this.$http.get(api.SYS_USER_ROLE + "?id=" + row.id)
        //   .then(res => {
        //     this.$refs.roleTree.setCheckedKeys(res.data);
        //   }).catch(err=>{

        // })
      },
      configUserRoles(){
        let checkedKeys = this.$refs.roleTree.getCheckedKeys();
          this.$http.get(api.SYS_SET_USER_ROLE + "?userId=" + this.currentRow.id + "&roleIds="+checkedKeys.join(','))
          .then(res => {
              this.$message('修改成功');
              this.dialogVisible = false;
          })
      },
      handleSizeChange(val) {
        this.tableData.pagination.pageSize = val;
        this.loadData();
      },
      handleCurrentChange(val) {
        this.tableData.pagination.pageNo = val;
        this.loadData();
      },
      handleEdit(index, row){
        console.log(this.tableData.pagination.pageNo);
        // this.$router.push({path: 'sjyglUpdate', params: {pageNumber:'1',pageSize:'5'},query: {id: row.id,pageNumber:'1',pageSize:'5'}})
        
         this.$confirm('确认该数据源是否正在使用, 确认是否修改?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {
         

           
                 this.$router.push({path: 'sjyglUpdate',query: {id: row.id,pageNumber:'1',pageSize:'5'}})
              


          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消修改'
            });
          });





        
     

      },
      handleDelete(index, row){
        // this.$http.get(api.SYS_USER_DELETE + "?userIds=" + row.id).then(res => {
        //   this.loadData();
        // });
        



        this.$confirm('确认该数据源是否正在使用, 确认是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {
         

           
            return http_sjygl
              .deleteSJYbyID({id:row.id})
              .then(res => res)
              .then(data => {
                  if(data.data.code==200)
                  {
                    this.loadData();
                      this.$message(data.data.msg);
                
                  }else{
                    this.$message(data.data.msg);
                  }
              }).catch(e => {  this.$message('接口操作失败');})




          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });



      },
      loadData(){
          // http_sjygl.getSJY({
          //   key: this.searchKey,
          //   pageSize: this.tableData.pagination.pageSize,
          //   pageNo: this.tableData.pagination.pageNo
          // })
          // .then(res => {
          //   this.tableData.rows = res.records;
          //   this.tableData.pagination.total = res.total;
          // });

          let param={
            name: this.searchKey,
               typeId: this.typeId,
            pageSize: this.tableData.pagination.pageSize,
            pageNumber: this.tableData.pagination.pageNo
          };
          return http_sjygl
          .getSJY(param)
          .then(res => res)
          .then(data => {
              if(data.data.code==200)
              {
                  this.tableData.rows = data.data.data.rows;
                  this.tableData.pagination.total = data.data.data.total;
            
              }else{
                 this.$message(data.data.msg);
              }
          }).catch(e => {  this.$message('接口操作失败');})


      },
      loadData2(){
          // http_sjygl.getSJY({
          //   key: this.searchKey,
          //   pageSize: this.tableData.pagination.pageSize,
          //   pageNo: this.tableData.pagination.pageNo
          // })
          // .then(res => {
          //   this.tableData.rows = res.records;
          //   this.tableData.pagination.total = res.total;
          // });

          let param={
            typeId: this.typeId,
            pageSize: this.tableData.pagination.pageSize,
            pageNumber: this.tableData.pagination.pageNo
          };
          return http_sjygl
          .getSJYbyType(param)
          .then(res => res)
          .then(data => {
              if(data.data.code==200)
              {
                  this.tableData.rows = data.data.data.rows;
                  this.tableData.pagination.total = data.data.data.total;
            
              }else{
                 this.$message(data.data.msg);
              }
          }).catch(e => {  this.$message('接口操作失败');})


      }



    },
    created(){
      this.load();
      this.loadData();
    
    },
     mounted() {
          
       this.setSvgEvent();
        this.setProject();
     
     }
  }
</script>

<style scoped>

.menu{
  position: absolute;
  left:20px;
  top:20px;
  background: #eee;
  padding: 10px;
  cursor: pointer;
}
 .sjyright >>> .el-card__body{
 height: 100%;
}
.sjyright{
  height: 500px;
}
svg{
      border: 1px solid #eee;
}

rect {
    /* width:180px; 
    height:36px;
    cursor: pointer;
    stroke: #333;
    stroke-width:2;
    fill: #fff; */
}


  .select-tree .icons-wrapper {
    display: block;
  }

  .select-tree .is-empty i {
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    display: inline-block;
    cursor: pointer;
  }

  .select-tree .is-empty i:hover {
    background-color: #0d6aad;
    color: #ffffff;
  }
   .el-pagination {
    float: right;
    margin-top: 15px;
  }
  .sjyleft{
      height: 500px;
      overflow-y: auto;
  }
   .sjytree{
     margin-top: 30px;
  }
   #sjylxtree >>> .el-tree-node__content{
    margin-top: 5px;
    font-size: 16px;
  }

</style>
