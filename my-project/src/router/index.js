import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/scroll/HelloWorld'
import Swiper from '@/components/swiper/swiperdome'
import Toast from '@/components/toast/toast'
import Fixedinput from '@/components/fixedinput/Fixedinput'
import Upload from '@/components/uploadPic/Upload'
import Updownload from '@/components/elementUi/upDownLoad/Updownload'
import uploadImg from '@/components/uploadImg/uploadImg'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
     {
      path: '/swiper',
      name: 'Swiper',
      component: Swiper
    },
    {
    	path:'/fixedinput',
    	name:'Fixedinput',
    	component:Fixedinput
    },
     {
    	path:'/toast',
    	name:'Toast',
    	component:Toast
    },
    {
      path:'/upload',
      name:'Upload',
      component:Upload
    },
    {
      path:'/updownload',
      name:'Updownload',
      component:Updownload
    },
    {
      path: '/uploadImg',
      name: 'uploadImg',
      component: uploadImg
    }
  ]
})
