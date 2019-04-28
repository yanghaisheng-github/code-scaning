<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 用户管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="select_cate" placeholder="部门" class="handle-select mr10"></el-select>
        <el-select v-model="select_cate" placeholder="用户类型" class="handle-select mr10">
          <el-option key="1" label="所有" value="all"></el-option>
          <el-option key="2" label="系统维护联系人" value="系统维护联系人"></el-option>
          <el-option key="3" label="代码检测人员" value="代码检测人员"></el-option>
          <el-option key="4" label="安全架构师" value="安全架构师"></el-option>
        </el-select>
        <el-button type="primary" icon="search" @click="add">添加用户</el-button>
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
        <el-input v-model="select_word" placeholder="输入关键字搜索" class="handle-input mr10"></el-input>
      </div>

      <!-- 表格 -->
      <el-table
        :data="filterTableData.slice((this.cur_page - 1) * this.pageSize, this.cur_page * this.pageSize)"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="username" label="用户名" width="150"></el-table-column>
        <el-table-column prop="department" label="所属部门" width="150"></el-table-column>
        <el-table-column prop="usertype" label="用户类型" width="120"></el-table-column>
        <el-table-column prop="authority" label="用户权限" width="120"></el-table-column>
        <el-table-column label="操作" width="380" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handlePassword(scope.$index, scope.row)"
            >修改密码</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page.sync="cur_page"
          :page-size="pageSize"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPageCount"
        ></el-pagination>
      </div>
    </div>

    <!-- 添加弹出框 -->
    <el-dialog v-dialogDrag title="添加" :visible.sync="addVisible" width="30%">
      <el-form
        ref="addForm"
        :model="addform"
        :rules="addrules"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addform.username"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="department">
          <el-input v-model="addform.department"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="usertype">
          <el-select v-model="addform.usertype">
            <el-option label="系统维护联系人" value="系统维护联系人"></el-option>
            <el-option label="代码检测人员" value="代码检测人员"></el-option>
            <el-option label="安全架构师" value="安全架构师"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户权限" prop="authority">
          <el-select v-model="addform.authority">
            <el-option label="管理员" value="管理员"></el-option>
            <el-option label="普通用户" value="普通用户"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog v-dialogDrag title="编辑" :visible.sync="editVisible" width="30%">
      <el-form
        ref="form"
        :model="editform"
        :rules="addrules"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editform.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="department">
          <el-input v-model="editform.department"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="usertype">
          <el-input v-model="editform.usertype" placeholder="请填写全名"></el-input>
        </el-form-item>
        <el-form-item label="用户权限" prop="authority">
          <el-select v-model="editform.authority">
            <el-option label="管理员" value="管理员"></el-option>
            <el-option label="普通用户" value="普通用户"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改密码弹出框 -->
    <el-dialog v-dialogDrag title="修改密码" :visible.sync="passwordVisible" width="30%">
      <el-form
        ref="passwordform"
        :model="passwordform"
        :rules="passwordrules"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="原密码" prop="oldPw">
          <el-input v-model="passwordform.oldPw" placeholder="请输入原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPw">
          <el-input v-model="passwordform.newPw" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repPw">
          <el-input v-model="passwordform.repPw" placeholder="请再次输入新密码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passwordVisible = false">取 消</el-button>
        <el-button type="primary" @click="savePw">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog v-dialogDrag title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value !== this.passwordform.newPw) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      tableData: [],
      cur_page: 1,
      pageSize: 10,
      totalPageCount: 0,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      passwordVisible: false,
      addVisible: false,
      editVisible: false,
      delVisible: false,
      addform: {
        username: "",
        department: "",
        usertype: "",
        authority: ""
      },
      editform: {
        username: "",
        department: "",
        usertype: "",
        authority: ""
      },
      passwordform: {
        oldPw: "",
        newPw: "",
        repPw: ""
      },
      passwordrules: {
        oldPw: [{ required: true, message: "请输入原密码", trigger: "blur" }],
        newPw: [{ required: true, message: "请输入新密码", trigger: "blur" }],
        repPw: [
          {
            validator: validatePass,
            required: true,
            trigger: "blur"
          }
        ]
      },
      addrules: {
        username: [
          { required: true, message: "请输入系统名称", trigger: "blur" }
        ],
        usertype: [
          { required: true, message: "请输入系统维护人员", trigger: "blur" }
        ],
        authority: [
          { required: true, message: "请选择用户权限", trigger: "blur" }
        ]
      },
      idx: -1,
      rowx: {}
    };
  },
  created() {
    this.getData();
  },
  watch: {
    filterTableData: function(newValue) {
      if (this.select_word) {
        this.totalPageCount = newValue.length;
        this.cur_page = 1;
      } else {
        this.totalPageCount = this.tableData.length;
      }
    }
  },
  computed: {
    filterTableData: function() {
      return this.tableData
        .filter(
          data =>
            !this.select_word ||
            data.username
              .toLowerCase()
              .includes(this.select_word.toLowerCase()) ||
            data.department
              .toLowerCase()
              .includes(this.select_word.toLowerCase()) ||
            data.usertype.toLowerCase().includes(this.select_word.toLowerCase())
        );
    }
  },
  methods: {
    //点击下一页和点击页码时执行
    handleCurrentChange(currentPage) {
      this.cur_page = currentPage;
    },
    //改变每页显示数量时调用
    handleSizeChange(val) {
      this.pageSize = val;
    },
    // 获取系统清单表数据
    getData() {
      this.$axios.get("/users/table").then(res => {
        this.tableData = res.data;
        this.totalPageCount = this.tableData.length;
      });
    },

    filterTag(value, row) {
      return row.tag === value;
    },
    handlePassword(index, row) {
      this.idx = index;
      this.rowx = row;
      this.passwordVisible = true;
    },
    savePw() {
      this.$refs.passwordform.validate(valid => {
        if (valid) {
          this.$axios
            .post("/users/table/modifyPw", {
              username: this.rowx.username,
              oldPw: this.passwordform.oldPw,
              pw: this.passwordform.newPw
            })
            .then(res => {
              if (res.data.status == "false") {
                this.$message.error(res.data.msg);
              } else {
                this.$message.success(res.data.msg);
              }
            });
          this.passwordform.newPw = this.passwordform.oldPw = this.passwordform.repPw =
            "";
          this.passwordVisible = false;
        }
      });
    },
    handleEdit(index, row) {
      this.idx = index;
      this.rowx = row;
      this.editform = {
        username: row.username,
        department: row.department,
        usertype: row.usertype,
        authority: row.authority
      };
      this.editVisible = true;
    },
    handleDelete(index, row) {
      this.idx = index;
      this.rowx = row;
      this.delVisible = true;
    },
    //显示添加弹出框
    add() {
      this.addVisible = true;
    },
    // 添加新数据到界面和数据库
    addData() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          var newform = {
            username: this.addform.username,
            department: this.addform.department,
            usertype: this.addform.usertype,
            authority: this.addform.authority
          };
          this.addVisible = false;

          // 发送数据给服务器，添加到数据库
          this.$axios
            .post("/users/table/add", newform)
            .then(res => {
              if (res.data.status == "success") {
                newform.date = res.data.msg;
                //添加数据到界面
                this.tableData.push(newform);
                this.$message({
                  showClose: true,
                  message: "已成功添加到数据库",
                  type: "success"
                });
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(err => {
              alert(err);
            });
          this.addform.username = this.addform.department = this.addform.usertype =
            "";
        } else {
          this.$message({
            showClose: true,
            message: "请将必要信息填写完整后再提交",
            type: "warning"
          });
        }
      });
    },
    delAll() {
      //在界面中删除数据
      this.tableData = this.tableData.filter(element => {
        let is_del = true;
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (element.username == this.multipleSelection[i].username)
            is_del = false;
        }
        return is_del;
      });
      //发送删除数据
      let del_list_name = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        del_list_name.push(this.multipleSelection[i].username);
      }
      this.$axios
        .post("/users/table/delete", { multiUsers: del_list_name })
        .then(res => {
          if (res.data.status) {
            this.$message.success(res.data.msg);
          }
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 保存编辑
    saveEdit() {
      this.editVisible = false;
      //发送修改数据到数据库
      this.$axios.post("/users/table/edit", this.editform).then(res => {
        if (res.data.status) {
          this.tableData.forEach((element, index) => {
            if (element.username == this.rowx.username)
              this.$set(this.tableData, index, this.editform);
          });
          this.$message.success(res.data.msg);
        }
      });
    },
    // 确定删除
    deleteRow() {
      //发送删除数据
      this.$axios
        .post("/users/table/delete", {
          username: this.rowx.username,
          multiUsers: ""
        })
        .then(res => {
          if (res.data.status) {
            this.delVisible = false;
            this.tableData = this.tableData.filter(element => {
              let is_del = true;
              if (element.username == this.rowx.username) is_del = false;
              return is_del;
            });
            this.$message.success(res.data.msg);
          }
        });
    }
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 150px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
</style>
