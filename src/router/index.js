import Vue from 'vue'
import VueRouter from 'vue-router'
import subrouter from "./subrouter"
Vue.use(VueRouter)

const Layout = () =>
    import ( /* webpackChunkName: "about" */ '@/views/Layout')

const routes = [{
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: "/index",
    children: [
        ...subrouter
    ]
}]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router