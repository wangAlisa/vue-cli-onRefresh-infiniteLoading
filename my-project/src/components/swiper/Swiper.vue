<template>
  <div class="wrap" v-cloak>
    <!-- 图片 -->
    <ul class="swiper" ref="swiper" @touchstart='startfn($event)' @touchmove='movefn($event)' @touchend='endfn($event)'>
        <li class="item" :style="{'width':w+'px'}" v-if="options.loop">
          <a :href="swiperimg[swiperimg.length-1].href"><img :src="swiperimg[swiperimg.length-1].src" ref="img" /></a>
        </li>
        <li class="item" v-for="(item,index) in swiperimg" :style="{'width':w+'px'}" :key="index">
          <a :href="item.href"><img :src="item.src" @load="successLoadImg" ref="img" /></a>
        </li>
        <li class="item" :style="{'width':w+'px'}" v-if="options.loop">
          <a :href="swiperimg[0].href"><img :src="swiperimg[0].src" ref="img" /></a>
        </li>
    </ul>
    <!--  左右按钮-->
    <span class="prevbtn" ref="prevbtn" v-show="options.prevnextbtn"  @click='go($event,-1)'>&lt;</span>
    <span class="nextbtn" ref="nextbtn"  v-show="options.prevnextbtn"   @click="go($event,1)">&gt;</span>
    <div class="dotbtn" ref="dotbtn" v-show="options.dotbtn && loadImgtemp">
        <span v-for="(item,index) in swiperimg" :key="index"  @click='dotclick(index)'>{{index+1}}</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      x:-document.documentElement.getBoundingClientRect().width,//ul平移的大小
      w:document.documentElement.getBoundingClientRect().width,//获取屏幕的宽度
      oUl:'',
      aLi:'',
      iNow:1,
      bReady:true, //限制点击，当动画正在动时，将不能再点击
      downX:'',
      disX:'',
      timer:'', //自动播放时间id
      aSpan:'',
      speed:0,
      leng:0,
      dotbtnstyle:{},
      loadImgtemp:false //当图片没有加载出来时，先不显示小圆点
    }
  },
  mounted(){
    this.oUl=this.$refs.swiper;
    this.aLi=this.oUl.children;
    this.aSpan=this.$refs.dotbtn.children;
    this.leng=this.aLi.length;
    this.speed=this.options.speed || .5;
    this.dotbtnstyle=this.options.dotbtnstyle || {
      default:`width:20px;height: 20px; margin:0 10px;background: red;`,
      cur:`width:20px;height:20px;background:green;margin:0 10px;`
    }
    this.initswiper();
    this.dotsspanstyle();
  },
  props:['options','swiperimg'],
  methods:{
    initswiper(){
      this.oUl.style.width=this.leng*this.w+'px';
      if(this.options.loop){
        this.oUl.style.WebkitTransform='translateX('+this.x+'px)';
      }else{
        this.iNow=0;
        this.x=0;
        this.aSpan[0].style.background='green'
      }
      if(this.options.autoplay){this.autoplayfn()};
    },
    go(e,step){
      if(!this.options.loop){//没有循环的时候
        if(!!e.style){//自动播放时没有currentTarget //有问题，得修改
          if(this.iNow==this.aSpan.length-1){
            this.iNow=-1;
          }
        }
        if(!!e.currentTarget && e.currentTarget.style.opacity=='0.3'){
          return
        }
      }
      if(this.bready==false)return;
      this.bready=false;
      clearInterval(this.timer)
      this.iNow+=step;
      this.panduaniNow()
      this.setTransition(1)
    },
    startfn(ev){
       if(this.bready==false)return;
       this.bready=false;
       clearInterval(this.timer)
       this.oUl.style.WebkitTransition='none';
       this.downX=ev.targetTouches[0].pageX;
       this.disX=this.downX-this.x;
    },
    movefn(ev){//需要优化，如果用户上下滑动了 ev.preventDefault();
      ev.preventDefault();
      if(!this.options.loop && (ev.targetTouches[0].pageX-this.disX)>=100){
            this.oUl.style.WebkitTransform='translateX(100px)';
      }else if(!this.options.loop &&  (ev.targetTouches[0].pageX-this.disX)<=(-this.w*(this.leng-1)-100)){
      }else{
          this.oUl.style.WebkitTransform='translateX('+(ev.targetTouches[0].pageX-this.disX)+'px)';
      }

    },
    endfn(ev){
      this.$refs.swiper.removeEventListener('touchmove',this.movefn)
      var upX=ev.changedTouches[0].pageX;
      if(this.downX==upX){ //如果用户只是点击了一下
        this.bready=true;
      }
      if(Math.abs(upX-this.downX)>100){
          this.downX>upX ? this.iNow++ : this.iNow--
          if(!this.options.loop){
            this.iNow==-1 ? this.iNow=0 : ''
            this.iNow==this.leng ? this.iNow=this.leng-1 : ''
          }
          this.panduaniNow()
      }
      this.setTransition(1)
    },
    tend(){
      this.bready=true;
      this.oUl.removeEventListener('transitionend',this.tend,false);
      if(this.options.loop){
        if(this.iNow==this.leng-1){
            this.iNow=1;
        }
        if(this.iNow==0){
            this.iNow=this.leng-2;
        }
        this.setTransition(0)
      }else{
        this.setTransition(1)
      }

    },
    dotclick(index){
      if(!this.options.loop){
        if(index==this.iNow){return} //如果当前的显示和点击的是同一个，则return
      }
      if(this.options.loop){
        if((index+1)==this.iNow){return} //如果当前的显示和点击的是同一个，则return
      }
      if(this.bready==false)return;
      this.bready=false;
      clearInterval(this.timer)
      this.options.loop ?  this.iNow=index+1 : this.iNow=index;
      this.setTransition(1)
    },
    panduaniNow(){
        if(this.iNow==this.leng){this.iNow=this.leng-1;}
        if(this.iNow==-1){this.iNow=0;}
    },
    setTransition(type){
      // 如果传0 表示，要清掉动画 ，传1 表示正常动画
      if(type==0){
        this.oUl.style.WebkitTransition='none';
      }else{
        this.oUl.style.WebkitTransition=this.speed+'s all ease';

        this.oUl.addEventListener('transitionend',this.tend,false);
        this.dotsspancur()
        this.dotsspanstyle()
      }
      this.x=-this.iNow*this.w;
      this.oUl.style.WebkitTransform='translate3d('+this.x+'px,0,0)';
      if(this.options.autoplay){this.autoplayfn()};
    },
    autoplayfn(){
      clearInterval(this.timer)
      this.timer=setInterval(()=>{
        this.go(this.$refs.nextbtn,1) //自动播放时第一个参数传nextbtn这个对象
      },this.options.autoplay)
    },
    dotsspancur(){
      if(!this.options.loop){
          //如果轮播不是循环时，当运动到第一个，或者第三个，则为透明，不能点击
        if(this.iNow==this.aSpan.length-1){
          this.$refs.nextbtn.style.opacity='.3'
          this.$refs.prevbtn.style.opacity='1'
        }else if( this.iNow==0){
          this.$refs.prevbtn.style.opacity='.3'
          this.$refs.nextbtn.style.opacity='1'
        }else{
          this.$refs.nextbtn.style.opacity='1'
          this.$refs.prevbtn.style.opacity='1'
        }
      }
    },
    dotsspanstyle(){
      for(var i=0;i<this.aSpan.length;i++){
          this.aSpan[i].setAttribute('style',this.dotbtnstyle.default)
      }
      var n;
      n= this.options.loop ? this.iNow-1 :this.iNow
      this.aSpan[(n+this.aSpan.length)%this.aSpan.length].setAttribute('style',this.dotbtnstyle.cur)
    },
    successLoadImg(){ //当有一个图片加载出来时，再显示小圆点
      this.loadImgtemp=true
    }
  }
}
/*
*author:lipanke
*day:2017-12-06
*update :2017-12-13
*使用方法：
1： import swiper from './Swiper'
2：data里的数据
swiperOption: { //基本配置
   autoplay: 500,//自动播放时间
   //dotbtn :true, //是否显示下面的小点点
   prevnextbtn:true, //是否显示左右的按钮
   speed:.2,//运动的速度 以s为单位
   loop:true, //是否无缝滚动
   dotbtnstyle:{  //给小圆点配置样式，default是默认的样式，cur是当前显示的样式
    default:`width:14px;font-size:12px;height:14px;font-size:12px;background:purple;color:yellow;margin:0 5px;`,
    cur:`width:14px;font-size:12px;height:14px;font-size:12px;background:yellow;color:purple;margin:0 5px;`
  }
},
swiperimg:[
  {
    href:'https://www.baidu.com/',
    src:require('../assets/swiper1.jpg')
  },
  {
    href:'https://www.taobao.com/',
    src:require('../assets/swiper2.jpg')
  }

  3：<swiper :options="swiperOption" :swiperimg="swiperimg"></swiper>
  4：在components里注册
*/
</script>

<style scoped>
a,a:hover,a:active,a:visited,a:link,a:focus{-webkit-tap-highlight-color:rgba(0,0,0,0);-webkit-tap-highlight-color: transparent;}
[v-cloak]{display: none;}
.wrap{overflow: hidden;position: relative;}
.swiper{}
.swiper:after{content: '';display:block; clear: both;}
.item{float: left;}
.swiper a{display: block;}
.swiper img{width: 100%}
.prevbtn,.nextbtn{position: absolute;top:50%;transform: translateY(-50%);font-size: 30px; color: #fff;z-index: 2;}
.prevbtn{left:20px;}
.nextbtn{right:20px;}
.dotbtn {position: absolute;bottom: 14px;  width: 100%; display: flex;align-items: center; justify-content:center;}
.dotbtn span{border-radius: 50%; color: #fff; display: flex;justify-content: center;align-items: center}
</style>
