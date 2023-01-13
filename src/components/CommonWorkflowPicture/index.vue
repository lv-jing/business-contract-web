<template>
    <div class="workflowPicture">
        <div v-show="showImage">
            <img :src="imgUrl" style="width:100%"/>
      </div>
        <div v-show="!showImage" ref="imageWrapper" :style="imageStyle">
            <div class="start">
                <div class="startContent">
                    <p>开始</p>
                </div>
            </div>
            <div class="startLine doneLine"></div>
            <div v-for="(item,index) in divLevel" :key="index">
                <div v-if="index%2==0">
                    <div v-for="(num,aa) in nodeNums" :key="aa">
                        <div v-if="divFlag(index,num)" class="node" :style="nodeStyle(index,num)">
                            <div :class="'nodeName '+processData[index*4 + num - 1].processDeptType">{{processData[index*4 + num - 1].processDeptName===null?"开始":processData[index*4 + num - 1].processDeptName}}</div>
                            <div :class="processData[index*4 + num - 1].attribute10==='WAIT_FOR_DEAL' && !isEnd?'currentNode':'nodeContent'">
                                <el-popover
                                    placement="top"
                                    title="审批历史"
                                    width="300"
                                    trigger="click"
                                >
                                    <el-row style="font-size:10px">
                                        <el-col :span="3">序号</el-col>
                                        <el-col :span="6">审批人</el-col>
                                        <el-col :span="15">处理时间</el-col>
                                    </el-row>
                                    <hr style="margin-top:4px;margin-bottom:4px">
                                    <el-row style="font-size:10px" v-for="(user,bb) in processHistory[processData[index*4 + num - 1].taskKey]" :key="bb">
                                        <el-col :span="3">{{bb+1}}</el-col>
                                        <el-col :span="6">{{user.approverName}}</el-col>
                                        <el-col :span="15">{{user.approvalTime}}</el-col>
                                    </el-row>
                                    <div class="approvalInfo" slot="reference">
                                        <div class="word"><i class="el-icon-postcard li"></i>{{processData[index*4 + num - 1].nodeName}}</div>
                                        <div class="word">
                                            <i class="el-icon-user  li"></i>
                                            <span  v-for="(user,bb) in processData[index*4 + num - 1].ecmBusinessMemberVoList" :key="bb">{{user.memberName}}&nbsp; &nbsp;</span>
                                        </div>
                                        <div class="ok" v-if="processData[index*4 + num - 1].attribute10==='ALREADY_DEAL' || isEnd"><i class="el-icon-success"></i></div>
                                    </div>
                                </el-popover>
                            </div>
                        </div>
                        <div v-if="divFlag(index,num) && num<4" :style="lineStyle(index,num)" :class="processData[index*4 + num - 1].attribute10==='ALREADY_DEAL' || isEnd?'lineLeftArrow doneLine':'lineLeftArrow'"></div>
                        <div v-if="divFlag(index,num) && num==4" :style="lineStyle(index,4,'left')" :class="processData[index*4 + num - 1].attribute10==='ALREADY_DEAL' || isEnd?'lineArrowDown doneLine':'lineArrowDown'"></div>
                    </div>
                </div>
                <div v-else-if="index%2==1">
                    <div v-for="(num,aa) in nodeNums" :key="aa">
                        <div  v-if="divFlag(index,num)" class="node" :style="nodeStyle(index,num)">
                            <div :class="'nodeName '+processData[index*4 + num - 1].processDeptType">{{processData[index*4 + num - 1].processDeptName}}</div>
                            <div :class="processData[index*4 + num - 1].attribute10==='WAIT_FOR_DEAL' && !isEnd?'currentNode':'nodeContent'">
                                <el-popover
                                    placement="top"
                                    title="审批历史"
                                    width="300"
                                    trigger="click"
                                >
                                    <el-row style="font-size:10px">
                                        <el-col :span="3">序号</el-col>
                                        <el-col :span="6">审批人</el-col>
                                        <el-col :span="15">处理时间</el-col>
                                    </el-row>
                                    <hr style="margin-top:4px;margin-bottom:4px">
                                    <el-row style="font-size:10px" v-for="(user,bb) in processHistory[processData[index*4 + num - 1].taskKey]" :key="bb">
                                        <el-col :span="3">{{bb+1}}</el-col>
                                        <el-col :span="6">{{user.approverName}}</el-col>
                                        <el-col :span="15">{{user.approvalTime}}</el-col>
                                    </el-row>
                                    <div class="approvalInfo" slot="reference">
                                        <div class="word"><i class="el-icon-postcard li"></i>{{processData[index*4 + num - 1].nodeName}}</div>
                                        <div class="word">
                                            <i class="el-icon-user  li"></i>
                                            <span  v-for="(user,bb) in processData[index*4 + num - 1].ecmBusinessMemberVoList" :key="bb">{{user.memberName}}&nbsp; &nbsp;</span>
                                        </div>
                                        <div class="ok" v-if="processData[index*4 + num - 1].attribute10==='ALREADY_DEAL' || isEnd"><i class="el-icon-success"></i></div>
                                    </div>
                                 </el-popover>
                            </div>
                        </div>
                        <div v-if="divFlag(index,num) && num<4" :style="lineStyle(index,num)" :class="processData[index*4 + num - 1].attribute10==='ALREADY_DEAL' || isEnd?'lineRightArrow doneLine':'lineRightArrow'"></div>
                        <div v-if="divFlag(index,num) && num==4" :style="lineStyle(index,4,'right')" :class="processData[index*4 + num - 1].attribute10==='ALREADY_DEAL' || isEnd ?'lineArrowDown doneLine':'lineArrowDown'"></div>
                    </div>
                </div>
            </div>
            <div :class="isEnd?'end endColor':'end'" :style="endStyle()"><div class="endContent">END</div></div>
        </div>
    </div>
</template>

<script>
import html2canvas from "html2canvas"
import {getBpmProcessTaskVoListById,getProcessPathById,getBpmProcessTaskOpnionVoListById} from '@/service/work/index'
export default {
    data(){
        return {
            marginTop :50,
            marginLeft:150,
            nodeWidth :150,
            nodeHeight :60,
            lineWidth: 60,
            endWidth: 50,
            processData :[],
            divLevel : 2,
            nodeNums:[1,2,3,4],
            imgUrl:'',
            showImage:false,
            imageStyle:{},
            processHistory:[],
            processOpitons:{},
            isEnd:false
        }
    },
    props:{
        workflowHistoryId:{
            type:String,
            default:""
        },
        linkHeadId:{
            type:String,
            default:""
        }
    },
    watch:{
        workflowHistoryId(val){
        this.getProcessHistory()
        this.initData()
        },
        linkHeadId(val){
            this.initData()
        }
    },
    created(){

    },
    mounted(){
        if(!this.linkHeadId){
            // 如果是从流程定义过来的，则不要调用审批历史记录
            this.getProcessHistory()
        }
        this.initData()
        // this.$nextTick(()=>{
        //     setTimeout(()=>{

        //     this.toImage()
        //     },100)
        // })
    },
    methods:{
        async initData(){
            let params = {id:this.workflowHistoryId,linkHeadId:this.linkHeadId}
            this.processData = []
            const {code,data} = await getProcessPathById(params)
            this.processData = data
            this.divLevel = Math.ceil(this.processData.length / 4)
            let height = this.divLevel * (this.nodeHeight + this.lineWidth + 4) + this.marginTop * 2
            let width = 4 * (this.nodeWidth + this.lineWidth) + 60 + this.marginLeft
            this.imageStyle = { height:height+'px',width:width+'px'}
        },
        async getProcessHistory(){
             let params = {id:this.workflowHistoryId}
            let history = {}
            const {code,data} = await getBpmProcessTaskVoListById(params)
            if(data){
                data.forEach(element => {
                    if(history[element.taskKey]){
                        history[element.taskKey].push(element)
                    }else{
                        history[element.taskKey] = []
                        history[element.taskKey].push(element)
                    }
                   if( element.objectStauts === 'OBJECT_APPROVED'){
                        this.isEnd = true
                   }
                });
               this.processHistory = {...history}
            }else{
                this.isEnd = false
            }
        },
        toImage() {
            html2canvas(this.$refs.imageWrapper).then(canvas => {
            let dataURL = canvas.toDataURL("image/png",1);
            this.imgUrl = dataURL;
                if (this.imgUrl !== "") {
                    this.showImage = true;
                }
            });
        },
        nodeStyle(index,nodePoition){
            let left = 0
            let top = 30
            top = this.marginTop
            if(index%2 === 0){
                // 偶数层
                left =  (nodePoition-1) * (this.nodeWidth + this.lineWidth) + this.marginLeft
                if(index!==0){
                    top += (this.lineWidth+ 4) * index   + this.nodeHeight * index
                }
            }else{
                // 奇数层
              left =  (4-nodePoition) * (this.nodeWidth + this.lineWidth) + this.marginLeft
              top += (this.lineWidth+ 4) * index + this.nodeHeight * index
            }
            return {left: left+"px",top: top+"px"}
        },
        lineStyle(index,nodePoition,end){
            let style = this.nodeStyle(index,nodePoition)
            let left = parseInt(style.left.replace('px',''))
            let top = parseInt(style.top.replace('px',''))
            if(index%2 === 0){
                left += this.nodeWidth
            }else{
                left -= this.lineWidth
            }
            top += this.nodeHeight/2
            if(end==='left'){
                left = left - this.nodeWidth/2
                top += this.nodeHeight/2
            }else if(end === 'right'){
                left = left + this.nodeWidth/2 + this.lineWidth
                top += this.nodeHeight/2
            }
            return {left: left+"px",top: top+"px"}
        },
        divFlag(index,nodePoition){
           return index*4 + nodePoition <= this.processData.length
        },
        endStyle(){
            let levleNum = this.divLevel % 2
            let num = this.processData.length % 4
            let style = {}
            let left = 0
            let top = 0

            if(levleNum==0){
                // 偶数层
                if(num===0){
                    // 最后一个是向下的箭头,在最右边，高度为，
                   style = this.lineStyle(this.divLevel-1,4,'right')
                   left = parseInt(style.left.replace('px','')) - this.endWidth / 2
                   top = parseInt(style.top.replace('px','')) + this.lineWidth  + 4
                }else{
                  style =  this.lineStyle(this.divLevel-1,num,'')
                  left = parseInt(style.left.replace('px','')) - this.lineWidth + 6
                  top = parseInt(style.top.replace('px','')) - this.endWidth / 2
                }
            }else{
                //奇数层
                if(num===0){
                    // 最后一个是向下的箭头
                   style = this.lineStyle(this.divLevel-1,4,'left')
                   left = parseInt(style.left.replace('px','')) - this.endWidth / 2
                   top = parseInt(style.top.replace('px','')) + this.lineWidth + 4
                }else{
                   style = this.lineStyle(this.divLevel-1,num,'')
                   left = parseInt(style.left.replace('px','')) + this.lineWidth
                   top = parseInt(style.top.replace('px','')) - this.endWidth / 2
                }
            }
             return {left: left+"px",top: top+"px"}
        },
        processDeptNameColor(name){
            if(name==='PDT001'){
                return 'nodeName'
            }else if(name==='PDT002'){
                 return 'nodeName '
            }
            else if(name==='PDT003'){
                 return 'nodeName '
            }else{
                return 'nodeName'
            }
        }
    }
}
</script>

<style lang="less">
.workflowPicture{
    height: 500px;
    position: relative;
    overflow: auto;
    .doneLine{
        background-color:#5ABB3C !important;
    }
    .doneLine:before{
        border-left-color: #5ABB3C !important;
    }
    .currentNode{
       border: 1px solid #2393F7  !important;
       height: 42px;
       width: 148px;
       background-color: rgb(233,244,254);
    }
    .start{
        position:absolute;
        width:60px;
        height:60px;
        top:50px;
        border-radius:50%;
        left:30px;
        text-align: center;
        background: #ffffff;
        border: 1px solid #5ABB3C ;
        color: #5ABB3C;
    }
    .startContent{
        font-family: PingFangSC-Regular;
        font-size: 12px;
        margin-top: 20px;
        margin-left: 2px;
    }
    .startLine{
        position:absolute;
        display: inline-block;
        width:60px;
        height:2px;
        background-color:#BBBFC4;
        top:75px;
        left:90px;
    }
    .startLine:before{
        content: '';
        border-color: transparent;       /*伪元素边框颜色为透明*/
        border-style: solid;
        position: absolute;               /*伪元素绝对定位*/
        border-left-color: #BBBFC4;
        border-width: 4px;
        left: 56px;
        top: -3px;

    }
    .end{
        position:absolute;
        width:50px;
        height:50px;
        border-radius:50%;
        background: #FFFFFF;
        border: 1px solid #FF3657;
        color: #FF3657;
    }
    .endContent{
        margin-top: 16px;
        margin-left: 10px;
    }
    .endColor{
        color: #fff;
        background-color: #FF3657;
    }
    .node{
        position:absolute;
        width:150px;
        height:60px;
        top:30px;
        background: #FFFFFF;
        border-radius: 2px;

    }
    .lineLeftArrow{
        position:absolute;
        display: inline-block;
        width:60px;
        height:2px;
        background-color:#BBBFC4;
        top:55px;
    }
    .lineLeftArrow:before{
        content: '';
        border-color: transparent;       /*伪元素边框颜色为透明*/
        border-style: solid;
        position: absolute;               /*伪元素绝对定位*/
        border-left-color: #BBBFC4;
        border-width: 4px;
        left: 56px;
        top: -3px;
    }

    .lineArrowDown{
			position:absolute;
            display: inline-block;
            width:2px;
            height:60px;
            background-color:#BBBFC4;
            top:80px;
            left:470px;
        }

	.lineArrowDown:before{
        content: '';
        border-color: transparent;       /*伪元素边框颜色为透明*/
        border-style: solid;
        position: absolute;               /*伪元素绝对定位*/
        border-top-color: #BBBFC4;
        border-width: 4px;
        left: -3px;
        top: 60px;
    }

    .lineRightArrow{
        position:absolute;
        display: inline-block;
        width:60px;
        height:2px;
        background-color: #BBBFC4;
        top:55px;
    }
    .lineRightArrow:before{
        content: '';
        border-color: transparent;       /*伪元素边框颜色为透明*/
        border-style: solid;
        position: absolute;               /*伪元素绝对定位*/
        border-right-color: #BBBFC4;
        border-width: 4px;
        left: -4px;
        top: -3px;
    }
    .nodeName{
        font-size: 12px;
        width: 100%;
        height: 16px;
        font-family: PingFangSC-Regular;
        color: #FFFFFF;
        letter-spacing: 0;
        line-height: 14px;
        background: #5ABB3C;
        text-align: center;
        padding-top: 2px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .PDT001{
         background: #1075D1 !important;
    }
     .PDT002{
         background: #0DD0D9 !important;
    }
     .PDT003{
         background: #FFBC33 !important;
    }
    .nodeContent{
        border: 1px solid #BBBFC4;
        width: 148px;
        height: 42px;
    }
    .word{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .approvalInfo{
        font-size: 12px;
        width: 100%;
        margin: 5px 7px 5px 7px;
        .li{
            padding-right: 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .ok{
        position: absolute;
        font-size: 14px;
        color: #5ABB3C;
        right: 5px;
        bottom: 5px;
    }

}
</style>
