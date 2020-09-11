<template>
<div class="home">
    <div>
        <div>
            <Aside class="leftNav" />
        </div>
        <div :class="{ hasTagsView: reversedMessage }" class="sideRight">
            <el-header>
                <el-button @click="clickBtnv" type="primary">加载中</el-button>
            </el-header>
            <el-main>
                <keep-alive>
                    <router-view />
                </keep-alive>
            </el-main>
        </div>
    </div>
</div>
</template>

<script>
// @ is an alias to /src
import Aside from "./Aside";
export default {
    name: "Layout",
    data() {
        return {
            needTagsView: true,
        };
    },
    components: {
        Aside,
    },
    methods: {
        clickBtnv() {
            this.$store.dispatch("toggleSideBar");
        },
    },
    computed: {
        reversedMessage: function () {
            return this.$store.state.tagsView;
        },
    },
};
</script>

<style>
.home {
    width: 100%;
    height: 100%;
    position: relative;
}

.home .leftNav {
    -webkit-transition: width 0.28s;
    transition: width 0.28s;
    width: 200px !important;
    background-color: #304156;
    height: 100%;
    position: fixed;
    font-size: 0;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
}

.sideRight {
    margin-left: 200px;
}

.hasTagsView {
    margin-left: 54px;
}
</style>
