<!-- 使用demo -->
<!-- 说明
 1.引入scroll组件；
 2.按照以下格式在该组件中使用
 -->
<template>
  <div>
      <v-scroll :on-refresh="onRefresh" :on-infinite="onInfinite">
       <ul>
         <li v-for="(item,index) in listdata" >{{item.name}}</li>
         <li v-for="(item,index) in downdata" >{{item.name}}</li>
          <li v-for="(item,index) in listdata" >{{item.name}}</li>
         <li v-for="(item,index) in downdata" >{{item.name}}</li>
          <li v-for="(item,index) in listdata" >{{item.name}}</li>
         <li v-for="(item,index) in downdata" >{{item.name}}</li>
       </ul>
    </v-scroll>
  </div>
</template>
<script>
import Scroll from './scroll';
import axios from 'axios'
export default{
 data () {
    return {
      counter : 1, //默认已经显示出15条数据 count等于一是让从16条开始加载
      num : 15,  // 一次显示多少条
      pageStart : 0, // 开始页数
      pageEnd : 0, // 结束页数
      listdata: [], // 下拉更新数据存放数组
      downdata: []  // 上拉更多的数据存放数组
    }
  },
  mounted : function(){
     this.getList();
  },
  methods: {
    getList(){
      let vm = this;
        axios.get('https://api.github.com/repos/typecho-fans/plugins/contents/').then((response) => {
          vm.listdata = response.data.slice(0,15);
         }, (response) => {
            console.log('error');
        });
    },
    onRefresh(done) {
      this.getList();
      done() // call done
    },
    onInfinite(done) {
      let vm = this;
      axios.get('https://api.github.com/repos/typecho-fans/plugins/contents/').then((response) => {
        vm.counter++;
        vm.pageEnd = vm.num * vm.counter;
        vm.pageStart = vm.pageEnd - vm.num;
        let arr = response.data;
           let i = vm.pageStart;
           let end = vm.pageEnd;
           for(; i<end; i++){
              let obj ={};
              obj["name"] = arr[i].name;
              vm.downdata.push(obj);
               if((i + 1) >= response.data.length){
               this.$el.querySelector('.load-more').firstChild.innerHTML='我是有底线的'
                return;
              }
              }
        done() // call done
         }, (response) => {
          console.log('error');
      });
    }
  },
  components : {
    'v-scroll': Scroll
  }
}
</script>
