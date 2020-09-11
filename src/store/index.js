import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        tagsView: false
    },
    mutations: {
        TOGGLE_SIDEBAR: state => {
            state.tagsView = !state.tagsView
        }
    },
    actions: {
        toggleSideBar({ commit }) {
            commit('TOGGLE_SIDEBAR')
        },
    },
    modules: {}
})