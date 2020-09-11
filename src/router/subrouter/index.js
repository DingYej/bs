const homeRouter = [{
        path: 'index', //首页-产品列表页
        name: 'home',
        component: () =>
            import ( /* webpackChunkName: "home" */ '@/views/Home')
    }, {
        path: 'course', //首页-产品列表页
        name: 'course',
        component: () =>
            import ( /* webpackChunkName: "home" */ '@/views/Course')
    },
    {
        path: 'noticeIndex', //首页-产品列表页
        name: 'noticeIndex',
        component: () =>
            import ( /* webpackChunkName: "home" */ '@/views/NoticeIndex')
    }, {
        path: 'courseStatistic', //首页-产品列表页
        name: 'courseStatistic',
        component: () =>
            import ( /* webpackChunkName: "home" */ '@/views/CourseStatistic')
    },
    {
        path: 'smallClass', //首页-产品列表页
        name: 'smallClass',
        component: () =>
            import ( /* webpackChunkName: "home" */ '@/views/SmallClass')
    }
]

export default homeRouter;