<template>
<div class="app-container">
    <el-row :gutter="20">
        <!--部门数据-->
        <el-col :span="4" :xs="24">
            <div class="head-container">
                <el-input v-model="deptName" placeholder="请输入部门名称" clearable size="small" prefix-icon="el-icon-search" style="margin-bottom: 20px" />
            </div>
            <div class="head-container">
                <el-tree :data="deptOptions" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree" default-expand-all @node-click="handleNodeClick" />
            </div>
        </el-col>
        <!--用户数据-->
        <el-col :span="20" :xs="24">
            <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
                <el-form-item label="用户名称" prop="userName">
                    <el-input v-model="queryParams.userName" placeholder="请输入用户名称" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="手机号码" prop="phonenumber">
                    <el-input v-model="queryParams.phonenumber" placeholder="请输入手机号码" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="queryParams.status" placeholder="用户状态" clearable size="small" style="width: 240px">
                        <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                    </el-select>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker v-model="dateRange" size="small" style="width: 240px" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport">导入</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
                </el-col>
            </el-row>
            <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center" />
                <el-table-column label="用户编号" align="center" prop="userId" />
                <el-table-column label="用户名称" align="center" prop="userName" :show-overflow-tooltip="true" />
                <el-table-column label="用户昵称" align="center" prop="nickName" :show-overflow-tooltip="true" />
                <el-table-column label="部门" align="center" prop="dept.deptName" :show-overflow-tooltip="true" />
                <el-table-column label="手机号码" align="center" prop="phonenumber" width="120" />
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" active-value="0" inactive-value="1" @change="handleStatusChange(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime" width="160">
                    <template slot-scope="scope">
                        <span>{{ scope.row.createTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
                        <el-button v-if="scope.row.userId !== 1" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                        <el-button size="mini" type="text" icon="el-icon-key" @click="handleResetPwd(scope.row)">重置</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--<pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />-->
        </el-col>
    </el-row>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="用户昵称" prop="nickName">
                        <el-input v-model="form.nickName" placeholder="请输入用户昵称" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="归属部门" prop="deptId">
                        <treeselect v-model="form.deptId" :options="deptOptions" :disable-branch-nodes="true" :show-count="true" placeholder="请选择归属部门" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="手机号码" prop="phonenumber">
                        <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item v-if="form.userId == undefined" label="用户名称" prop="userName">
                        <el-input v-model="form.userName" placeholder="请输入用户名称" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
                        <el-input v-model="form.password" placeholder="请输入用户密码" type="password" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="用户性别">
                        <el-select v-model="form.sex" placeholder="请选择">
                            <el-option v-for="dict in sexOptions" :key="dict" :label="dict" :value="dict"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="状态">
                        <el-radio-group v-model="form.status">
                            <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{dict.dictLabel}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="岗位">
                        <el-select v-model="form.postIds" multiple placeholder="请选择">
                            <el-option v-for="item in postOptions" :key="item.postId" :label="item.postName" :value="item.postId" :disabled="item.status == 1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="角色">
                        <el-select v-model="form.roleIds" multiple placeholder="请选择">
                            <el-option v-for="item in roleOptions" :key="item" :label="item" :value="item" :disabled="item.status == 1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注">
                        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
    name: "Course",
    data() {
        return {
            deptName: "",
            // 部门树选项
            deptOptions: [{
                id: 1,
                label: '若依科技',
                disabled: true,
                children: [{
                    id: 3,
                    label: '深圳公司总部',
                    children: [{
                        id: 4,
                        label: '研发部门'
                    }, {
                        id: 5,
                        label: '市场部门'
                    }, {
                        id: 6,
                        label: '测试部门'
                    }, {
                        id: 7,
                        label: '财务部门'
                    }, {
                        id: 8,
                        label: '运维部门'
                    }]
                }, {
                    id: 2,
                    label: '长沙分公司',
                    disabled: true,
                    children: [{
                        id: 9,
                        label: '市场部门'
                    }, {
                        id: 10,
                        label: '运维部门'
                    }]
                }]
            }],
            defaultProps: {
                children: "children",
                label: "label",
            },
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                userName: undefined,
                phonenumber: undefined,
                status: undefined,
                deptId: undefined,
            },
            statusOptions: [{
                dictLabel: "正常",
                dictValue: "0"
            }, {
                dictLabel: "停用",
                dictValue: "1"
            }],
            postOptions: [{
                    postId: "11101",
                    postName: "董事长"
                },
                {
                    postId: "11102",
                    postName: "项目经理"
                },
                {
                    postId: "11103",
                    postName: "人力资源"
                },
                {
                    postId: "11104",
                    postName: "普通员工"
                }
            ],
            sexOptions: ["男", "女"],
            dateRange: [],
            // 角色选项
            roleOptions: ["超级管理员", "普通角色"],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 遮罩层
            loading: false,
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 用户表格数据
            userList: [{
                    userId: 11,
                    userName: "admin",
                    nickName: "若依",
                    dept: {
                        deptName: "研发部",
                        deptid: 4,
                    },
                    phonenumber: "17343149950",
                    row: {
                        status: true,
                        createTime: "2018-03-16 11:33:00"
                    },
                    createTime: "2018-03-16 11:33:00",
                    email: "dingye97@yeah.net",
                    sex: "男",
                    postIds: ["11102", "11103"],
                    roleIds: ["超级管理员"]
                },
                {
                    userId: 12,
                    userName: "第二教育网",
                    nickName: "丁烨",
                    dept: {
                        deptName: "研发部",
                        deptid: 4,
                    },
                    phonenumber: "17343149950",
                    row: {
                        status: true,
                        createTime: "2018-03-16 11:33:00"
                    },
                    createTime: "2018-03-16 11:33:00",
                    email: "dingye97@yeah.net",
                    sex: "男",
                    postIds: ["11102", "11103"],
                    roleIds: ["超级管理员"]
                }
            ],
            // 总条数
            total: 0,
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                userName: [{
                    required: true,
                    message: "用户名称不能为空",
                    trigger: "blur"
                }, ],
                nickName: [{
                    required: true,
                    message: "用户昵称不能为空",
                    trigger: "blur"
                }, ],
                deptId: [{
                    required: true,
                    message: "归属部门不能为空",
                    trigger: "blur"
                }, ],
                password: [{
                    required: true,
                    message: "用户密码不能为空",
                    trigger: "blur"
                }, ],
                email: [{
                        required: true,
                        message: "邮箱地址不能为空",
                        trigger: "blur"
                    },
                    {
                        type: "email",
                        message: "'请输入正确的邮箱地址",
                        trigger: ["blur", "change"],
                    },
                ],
                phonenumber: [{
                        required: true,
                        message: "手机号码不能为空",
                        trigger: "blur"
                    },
                    {
                        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                        message: "请输入正确的手机号码",
                        trigger: "blur",
                    },
                ],
            }
        };
    },
    components: {
        Treeselect
    },
    methods: {
        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 节点单击事件
        handleNodeClick(data) {
            // this.queryParams.deptId = data.id;
            // this.getList();
        },
        // 搜索
        handleQuery() {

        },
        // 重置
        resetQuery() {

        },
        // 新增
        handleAdd() {
            this.open = true;
        },
        // 修改
        handleUpdate() {

        },
        // 删除
        handleDelete() {

        },
        // 导入
        handleImport() {

        },
        // 导出
        handleExport() {

        },
        /** 查询用户列表 */
        getList() {

        },
        // 多选框选中数据
        handleSelectionChange() {

        },
        // 状态
        handleStatusChange(row) {
            let text = row.status === "0" ? "启用" : "停用";
            this.$confirm(
                    '确认要"' + text + '""' + row.userName + '"用户吗?',
                    "警告", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }
                )
                // .then(function () {
                //     return changeUserStatus(row.userId, row.status);
                // })
                .then(() => {
                    console.log("lll")
                    this.msgSuccess(text + "成功");
                })
                .catch(function () {
                    row.status = row.status === "0" ? "1" : "0";
                });
        },
        handleUpdate(row) {
            this.form = row;
            this.form.deptId = row.dept.deptid;
            console.log(this.form)
            this.open = true;
        },
        submitForm() {
            console.log(this.form)
            this.userList.concat(this.form)
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.deptId != undefined) {
                        this.msgSuccess("修改成功");
                        this.open = false;
                        this.getList();
                    }
                } else {
                    this.msgSuccess("新增成功");
                    this.open = false;
                    this.getList();
                }
            })
        },
        reset() {
            this.form = {
                deptId: undefined,
                parentId: undefined,
                deptName: undefined,
                orderNum: undefined,
                leader: undefined,
                phone: undefined,
                email: undefined,
                status: "0"
            };
            this.$refs["form"].resetFields();
        },
        cancel() {
            this.open = false;
            this.reset();
        },
        handleResetPwd() {

        }
    },
};
</script>

<style></style>
