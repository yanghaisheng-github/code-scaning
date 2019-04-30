<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 系统清单
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="select_cate" placeholder="系统重要性" class="handle-select mr10">
          <el-option key="1" label="所有" value="all"></el-option>
          <el-option key="2" label="重要信息系统" value="重要信息系统"></el-option>
          <el-option key="3" label="一级" value="一级"></el-option>
          <el-option key="4" label="二级非重要" value="二级非重要"></el-option>
        </el-select>
        <el-select v-model="select_cate" placeholder="代码检测人员" class="handle-select mr10">
          <el-option key="1" label="所有" value="all"></el-option>
          <el-option key="2" label="重要信息系统" value="重要信息系统"></el-option>
          <el-option key="3" label="一级" value="一级"></el-option>
          <el-option key="4" label="二级非重要" value="二级非重要"></el-option>
        </el-select>
        <el-select v-model="select_cate" placeholder="主办部门" class="handle-select mr10">
          <el-option key="1" label="所有" value="all"></el-option>
          <el-option key="2" label="重要信息系统" value="重要信息系统"></el-option>
          <el-option key="3" label="一级" value="一级"></el-option>
          <el-option key="4" label="二级非重要" value="二级非重要"></el-option>
        </el-select>
        <el-button type="primary" icon="search" @click="add">添加</el-button>
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
        <el-table-column prop="date" label="更新日期" sortable width="120"></el-table-column>
        <el-table-column prop="SystemName" label="系统名称" width="150"></el-table-column>
        <el-table-column prop="Department" label="主办部门" width="150"></el-table-column>
        <el-table-column prop="SecurityLevel" label="安全等级" sortable width="120"></el-table-column>
        <el-table-column prop="Maintenance" label="系统维护联系人" width="120"></el-table-column>
        <el-table-column prop="CodeChecker" label="代码检测人员" width="120"></el-table-column>
        <el-table-column prop="Architect" label="安全架构师" width="120"></el-table-column>
        <el-table-column prop="Language" label="代码语言" sortable width="120"></el-table-column>
        <el-table-column prop="Remark" label="备注" width="120"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
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
        <el-form-item label="系统名称" prop="SystemName">
          <el-input v-model="addform.SystemName"></el-input>
        </el-form-item>
        <el-form-item label="主办部门" prop="Department">
          <el-input v-model="addform.Department"></el-input>
        </el-form-item>
        <el-form-item label="安全等级" prop="SecurityLevel">
          <el-select v-model="addform.SecurityLevel" placeholder="请选择1或2或3或4">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统维护联系人" prop="Maintenance">
          <el-input v-model="addform.Maintenance" placeholder="请填写全名"></el-input>
        </el-form-item>
        <el-form-item label="代码检测人员" prop="CodeChecker">
          <el-input v-model="addform.CodeChecker" placeholder="请填写全名"></el-input>
        </el-form-item>
        <el-form-item label="安全架构师" prop="Architect">
          <el-input v-model="addform.Architect" placeholder="请填写全名"></el-input>
        </el-form-item>
        <el-form-item label="代码语言" prop="Language">
          <el-select v-model="addform.Language" placeholder="请选择扫描语言">
            <el-option label="Java" value="Java"></el-option>
            <el-option label="JavaScript" value="JS"></el-option>
            <el-option label="C" value="C"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="Remark">
          <el-input v-model="addform.Remark"></el-input>
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
        <el-form-item label="系统名称" prop="SystemName">
          <el-input v-model="editform.SystemName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="主办部门" prop="Department">
          <el-input v-model="editform.Department"></el-input>
        </el-form-item>
        <el-form-item label="安全等级" prop="SecurityLevel">
          <el-select v-model="editform.SecurityLevel" placeholder="请选择1或2或3或4">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统维护联系人" prop="Maintenance">
          <el-input v-model="editform.Maintenance" placeholder="请填写全名"></el-input>
        </el-form-item>
        <el-form-item label="代码检测人员" prop="CodeChecker">
          <el-input v-model="editform.CodeChecker" placeholder="请填写全名"></el-input>
        </el-form-item>
        <el-form-item label="安全架构师" prop="Architect">
          <el-input v-model="editform.Architect" placeholder="请填写全名"></el-input>
        </el-form-item>
        <el-form-item label="代码语言" prop="Language">
          <el-select v-model="editform.Language" placeholder="请选择扫描语言">
            <el-option label="Java" value="Java"></el-option>
            <el-option label="JavaScript" value="JS"></el-option>
            <el-option label="C" value="C"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="Remark">
          <el-input v-model="editform.Remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
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
    return {
      tableData: [],
      cur_page: 1,
      pageSize: 10,
      totalPageCount: 0,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      addVisible: false,
      editVisible: false,
      delVisible: false,
      addform: {
        date: "",
        SystemName: "",
        Department: "",
        SecurityLevel: "",
        Maintenance: "",
        CodeChecker: "",
        Architect: "",
        Language: "",
        Remark: ""
      },
      editform: {
        date: "",
        SystemName: "",
        Department: "",
        SecurityLevel: "",
        Maintenance: "",
        CodeChecker: "",
        Architect: "",
        Language: "",
        Remark: ""
      },
      addrules: {
        SystemName: [
          { required: true, message: "请输入系统名称", trigger: "blur" }
        ],
        Maintenance: [
          { required: true, message: "请输入系统维护人员", trigger: "blur" }
        ],
        CodeChecker: [
          { required: true, message: "请输入代码检测人员", trigger: "blur" }
        ],
        Architect: [
          { required: true, message: "请输入架构师人员", trigger: "blur" }
        ],
        Language: [
          { required: true, message: "请输入java或者C", trigger: "change" }
        ]
      },
      idx: -1,
      rowx: []
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
      return this.tableData.filter(
        data =>
          !this.select_word ||
          data.SystemName.toLowerCase().includes(
            this.select_word.toLowerCase()
          ) ||
          data.Department.toLowerCase().includes(
            this.select_word.toLowerCase()
          ) ||
          data.date.toLowerCase().includes(this.select_word.toLowerCase()) ||
          data.Maintenance.toLowerCase().includes(
            this.select_word.toLowerCase()
          ) ||
          data.CodeChecker.toLowerCase().includes(
            this.select_word.toLowerCase()
          ) ||
          data.Architect.toLowerCase().includes(
            this.select_word.toLowerCase()
          ) ||
          data.Language.toLowerCase().includes(
            this.select_word.toLowerCase()
          ) ||
          data.Remark.toLowerCase().includes(this.select_word.toLowerCase())
      );
    }
  },
  methods: {
    //获取当前时间
    timeFormat(timeStamp) {
      let year = new Date(timeStamp).getFullYear();
      let month =
        new Date(timeStamp).getMonth() + 1 < 10
          ? "0" + (new Date(timeStamp).getMonth() + 1)
          : new Date(timeStamp).getMonth() + 1;
      let date =
        new Date(timeStamp).getDate() < 10
          ? "0" + new Date(timeStamp).getDate()
          : new Date(timeStamp).getDate();
      let hh =
        new Date(timeStamp).getHours() < 10
          ? "0" + new Date(timeStamp).getHours()
          : new Date(timeStamp).getHours();
      let mm =
        new Date(timeStamp).getMinutes() < 10
          ? "0" + new Date(timeStamp).getMinutes()
          : new Date(timeStamp).getMinutes();
      return year + "年" + month + "月" + date + "日" + " " + hh + ":" + mm;
    },
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
      this.$axios.get("/systemlisting/table").then(res => {
        this.tableData = res.data;
        this.totalPageCount = this.tableData.length;
      });
    },

    filterTag(value, row) {
      return row.tag === value;
    },
    handleEdit(index, row) {
      this.idx = index;
      this.rowx = row;
      this.editform = {
        date: row.date,
        SystemName: row.SystemName,
        Department: row.Department,
        SecurityLevel: row.SecurityLevel,
        Maintenance: row.Maintenance,
        CodeChecker: row.CodeChecker,
        Architect: row.Architect,
        Language: row.Language,
        Remark: row.Remark
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
            date: this.addform.date,
            SystemName: this.addform.SystemName,
            Department: this.addform.Department,
            SecurityLevel: this.addform.SecurityLevel,
            Maintenance: this.addform.Maintenance,
            CodeChecker: this.addform.CodeChecker,
            Architect: this.addform.Architect,
            Language: this.addform.Language,
            Remark: this.addform.Remark
          };
          this.addVisible = false;

          // 发送数据给服务器，添加到数据库
          this.$axios
            .post("/systemlisting/table/add", newform)
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
          this.addform.SystemName = this.addform.Department = this.addform.SecurityLevel = this.addform.Maintenance = this.addform.CodeChecker = this.addform.Architect = this.addform.Remark =
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
          if (element.SystemName == this.multipleSelection[i].SystemName)
            is_del = false;
        }
        return is_del;
      });
      //发送删除数据
      let del_list_name = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        del_list_name.push({
          SystemName: this.multipleSelection[i].SystemName,
          Language: this.multipleSelection[i].Language
        });
      }
      this.$axios
        .post("/systemlisting/table/delete", del_list_name)
        .then(res => {
          if (res.data) {
            this.$message.success("删除成功");
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
      this.$axios.post("/systemlisting/table/edit", this.editform).then(res => {
        if (res.data) {
          this.editform.date = res.data;
          //this.$set(this.tableData, this.idx, this.editform);
          this.tableData.forEach((element, index) => {
            if (element.SystemName == this.rowx.SystemName)
              this.$set(this.tableData, index, this.editform);
          });
          this.$message.success(`修改第 ${this.idx + 1} 行成功`);
        }
      });
    },
    // 确定删除
    deleteRow() {
      let del_list_name = [];
      del_list_name.push({
        SystemName: this.rowx.SystemName,
        Language: this.rowx.Language
      });
      //发送删除数据
      this.$axios
        .post("/systemlisting/table/delete", del_list_name)
        .then(res => {
          if (res.data) {
            this.delVisible = false;
            this.tableData = this.tableData.filter(element => {
              let is_del = true;
              if (element.SystemName == this.rowx.SystemName) is_del = false;
              return is_del;
            });
            this.$message.success("删除成功");
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
