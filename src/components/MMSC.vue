<template>
  <div class>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> tab选项卡
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-tabs v-model="message">
        <el-tab-pane :label="`未读消息(${unread.length})`" name="first">
          <el-table :data="unread" :show-header="false" style="width: 100%">
            <el-table-column>
              <template slot-scope="scope">
                <span class="message-title">{{scope.row.msg}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="time" width="180"></el-table-column>
            <el-table-column width="120">
              <template slot-scope="scope">
                <el-button size="small" @click="handleRead(scope.$index, scope.row)">标为已读</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="handle-row">
            <el-button type="primary" @click="handleAllRead">全部标为已读</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`已读消息(${read.length})`" name="second">
          <template v-if="message === 'second'">
            <el-table :data="read" :show-header="false" style="width: 100%">
              <el-table-column>
                <template slot-scope="scope">
                  <span class="message-title">{{scope.row.msg}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="time" width="150"></el-table-column>
              <el-table-column width="120">
                <template slot-scope="scope">
                  <el-button type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="handle-row">
              <el-button type="danger" @click="handleDelAll">删除全部</el-button>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "tabs",
  data() {
    return {
      tableData: [],
      message: "first",
      showHeader: false,
      unread: [],
      read: [],
      recycle: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    handleRead(index, row) {
      // 根据用户和时间也判断该条消息唯一
      let unreadmsg = {
        username: sessionStorage.getItem("sca_username"),
        time: row.time
      };
      this.$axios.post("/mmsc/unreadchange/one", unreadmsg).then(res => {
        if (res != 0) {
          const item = this.unread.splice(index, 1);
          this.read = item.concat(this.read);
        } else {
          this.$message.warnning("无可标为已读的内容");
        }
      });
    },
    handleAllRead() {
      let unreadmsg = {
        username: sessionStorage.getItem("sca_username")
      };
      this.$axios.post("/mmsc/unreadchange/all", unreadmsg).then(res => {
        if (res != 0) {
          this.read = this.unread.concat(this.read);
          this.unread = [];
        } else {
          this.$message.warnning("无可标为已读的内容");
        }
      });
    },
    handleDel(index, row) {
      let deletemsg = {
        username: sessionStorage.getItem("sca_username"),
        time: row.time
      };
      this.$axios.post("/mmsc/delete/one", deletemsg).then(res => {
        if (res != 0) {
          this.read.splice(index, 1);
        } else {
          this.$message.warnning("无可删除的内容");
        }
      });
    },
    handleDelAll() {
      let deletemsg = {
        username: sessionStorage.getItem("sca_username")
      };
      this.$axios.post("/mmsc/delete/all", deletemsg).then(res => {
        if (res != 0) {
          this.read = [];
        } else {
          this.$message.warnning("无可标为已读的内容");
        }
      });
    },
    getData() {
      this.$axios
        .post("/mmsc/homepage", {
          username: sessionStorage.getItem("sca_username")
        })
        .then(res => {
          this.tableData = res.data;
          this.tableData.forEach(item => {
            if (item.status == "未读") {
              this.unread.push(item);
            } else {
              this.read.push(item);
            }
          });
        });
    }
  },
  computed: {
    unreadNum() {
      return this.unread.length;
    }
  }
};
</script>

<style>
.message-title {
  cursor: pointer;
}
.handle-row {
  margin-top: 30px;
}
</style>