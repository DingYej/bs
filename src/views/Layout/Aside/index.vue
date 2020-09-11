<template>
  <div :class="{ 'has-logo': reversedMessage }">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeClass"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#304156"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="reversedMessage"
        :router="true"
      >
        <template v-for="item in items">
          <template v-if="item.subs">
            <el-submenu :index="item.index" :key="item.index">
              <template slot="title">
                <i :class="item.icon"></i>
                <span slot="title">{{ item.title }}</span>
              </template>
              <template v-for="subItem in item.subs">
                <el-submenu
                  v-if="subItem.subs"
                  :index="subItem.index"
                  :key="subItem.index"
                >
                  <template slot="title">{{ subItem.title }}</template>
                  <el-menu-item
                    v-for="(threeItem, i) in subItem.subs"
                    :key="i"
                    :index="threeItem.index"
                    >{{ threeItem.title }}</el-menu-item
                  >
                </el-submenu>
                <el-menu-item
                  v-else
                  :index="subItem.index"
                  :key="subItem.index"
                  >{{ subItem.title }}</el-menu-item
                >
              </template>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :index="item.index" :key="item.index">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: "Aside",
  data() {
    return {
      isCollapse: true,
      items: [
        {
          icon: "el-icon-eleme",
          index: "index",
          title: "首页",
        },
        {
          icon: "el-icon-s-tools",
          index: "3",
          title: "备课模块",
          subs: [
            {
              index: "course",
              title: "备课中心",
            },
            {
              index: "noticeIndex",
              title: "我的课程",
            },
          ],
        },
        {
          icon: "el-icon-s-finance",
          index: "courseStatistic",
          title: "统计模块",
        },
        {
          icon: "el-icon-loading",
          index: "smallClass",
          title: "学生微课",
        },
      ],
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath, "111111111");
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath, "111111111");
    },
  },
  computed: {
    reversedMessage: function() {
      return this.$store.state.tagsView;
    },
    activeClass: function() {
      return this.$route.path.slice(1);
    },
  },
};
</script>

<style>
#app .el-scrollbar {
  height: 100%;
}
#app .scrollbar-wrapper {
  overflow-x: hidden !important;
}
#app .el-scrollbar {
  right: -1px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
#app .has-logo {
  width: 54px !important;
}
</style>
