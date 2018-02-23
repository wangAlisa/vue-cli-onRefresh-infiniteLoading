<!-- 
    案例说明：
    名称：fixed+input问题
    技术：vue2.0
    方案：
        1.将所有的fixed定位改成absolute定位;
        2.参照其他app的输入框，当用户触碰蒙层时，输入框关闭，键盘隐藏，并且保存用户输入的内容（案例中objContenText方法），
          这样做 (1)考虑用户习惯，点击空白处关闭当前信息；(2)避免ios用户滑动页面，将输入框划出用户视野;
        3.因为clik事件有2毫秒的延迟，所以案例中的事件采用touch事件。

    遗留问题：
        1.部分ios系统在第一次访问该页面时，调出的键盘遮挡部分输入框
        2.ios对fixed不兼容问题，可参考以下链接了解原因(https://github.com/Momo707577045/IOS_fixed2)
        3.安卓手机在钉钉中打开此页面链接，无法正常显示页面信息(此问题可通过编译解决，反馈和投诉项目中都没有此问题)。

    其他方案：
        通过@focus和@blur事件来监测输入框是获取焦点状态还是失去焦点状态，同时在获取焦点的时候让输入框距离底部一定距离，防止键盘遮挡住输入框，
        在失去焦点的时候让输入框重新回到底部。
        不使用此方法的原因是：
                1.由于不同机型的自带键盘高度不一致，同时h5无法正确获取键盘的高度；
                2.ios无法获取页面已经滚动的高度，所以依然无法获取键盘高度(反馈项目中尝试过此方法没成功,有兴趣自己可以再试)。
 -->


<template>
    <div id="app" :class="{'mostHeight':iscomment}" >
        <div v-for = "n in 8" class = "clickFn">
            <button @click.prevent="clickFn(n)">按钮{{n}}</button>
        </div>
        <div class="input-ailog"  v-if="iscomment" @touchstart="showinput">
        </div>   
        <div class="input-box" v-if="iscomment">
            <textarea class="test_box"  ref ="test_box" v-focus placeholder = "我也说一句..." style="left:0rem; right: 3rem;text-align:bottom;-webkit-user-select:text;" v-model="contentext" >
            </textarea>
            <div class = "input-content">
                <div class=" btnNum">最多<span class="btn10">1000</span>字</div>
                <button class="btnc"  @touchend="showinput">取消</button>
                <button class="btn"  @touchend="sedMessage">发送</button>
            </div>
        
        </div>
    </div>
</template>
<script>
export default {
    data(){
       return{
            iscomment:false,
            showFocus:false,
            contentext:'',
            json:{},
            idx:''
       }
     },
    methods:{
        objContenText:function(idx){
            if(idx || idx==0){
                for(var i in this.json ){
                    if(i == this.idx){
                        return this.json[i];
                    }
                }
            }else{
                this.json[this.idx] = this.contentext
                console.log('执行',this.json)
            }
        },
        clickFn(n){
            this.idx = n;
            let objContenText = this.objContenText(n)
            this.contentext = objContenText ? objContenText : ""
            this.iscomment = true;
        },
        showinput(){
            this.iscomment = false
            this.objContenText()
        },
        sedMessage(){
            console.log(123)
            this.iscomment = false
            this.json[this.idx] = ''
        }
    },
    directives: {
        focus: {
        // 指令的定义
            inserted: function (el) {
                el.focus()
            }
        }
    }
}
</script>
<style scoped>
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    html{
        font-size:20px;
    }
    .input-ailog{
		position:absolute;
		top:0;
		bottom:0;
		left: 0;
		right: 0;
        width:100%;
		background-color:rgba(0, 0, 0, 0.6);
		z-index: 2222;
	}
    .input-box {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background:#fff;
		z-index: 7777;
		padding-top:0.5rem;
        box-sizing: border-box;
	}
    .input-content{
        position:relative;
        width:100%;
        height:30px;
	}
    .test_box {
        width: 100%; 
        height:4rem;
        max-height: 4rem;
        outline: 0;
        border:none;
        border-bottom: 0.05rem solid rgba(218,218,218,.21); 
        font-size: 0.8rem; 
        word-wrap: break-word;
        overflow-x: hidden;
        overflow-y: auto;
        z-index: 7788;
        border-top: none;
        font-size: 0.7rem;
        border:1px solid #f00;
	}
    .btnc{
        position:absolute;
        right:2rem;
        top:0;
        padding: 0 0.8rem;
        font-size: 0.8rem;
        color: #717F8C;
        outline:none;
        border:none;
        background:#fff;
    }
    .btn{
        position:absolute;
        right:0;
        top:0;
        padding: 0 0.5rem;
        font-size: 0.8rem;
        color: #35ABFD;
        outline:none;
        border:none;
        background:#fff;
    }
    .btnNum{
        float:left;
        text-align: right;
        font-size: 0.6rem;
        height:0.8rem;
        line-height: 1.8rem;
        color:#bbb;
        margin-left: 0.5rem;
    }
    .btn10{
        color:#35ABFD;
    }
    .clickFn{
        height:100px;
        padding-top:50px;
    }

    .mostHeight{
        height:4rem;
        overflow:hidden;
    }
   
</style>