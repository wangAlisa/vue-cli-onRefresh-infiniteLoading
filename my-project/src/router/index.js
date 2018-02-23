import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/scroll/HelloWorld'
import Swiper from '@/components/swiper/swiperdome'
import Toast from '@/components/toast/toast'
import Fixedinput from '@/components/fixedinput/Fixedinput'

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
    }
  ]
})
