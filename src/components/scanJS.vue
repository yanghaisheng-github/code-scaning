<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> JavaScript代码扫描
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
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
        <el-table-column label="系统名称" prop="SystemName" width="150"></el-table-column>
        <el-table-column label="上传代码扫描" width="400">
          <template slot-scope="scope">
            <el-upload
              class="upload-demo"
              drag
              action="http://localhost:3000/upload/src/JS"
              ref="srcupload"
              :data="scope.row"
              :limit="1"
              :on-preview="handleSrcPreview"
              :on-exceed="handleSrcExceed"
              :before-remove="beforeSrcRemove"
              :on-success="handleSrcSuccess"
              :file-list="scope.row.srcfileList"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">请上传待扫描代码压缩文件，支持zip/tar等格式</div>
            </el-upload>
          </template>
        </el-table-column>
        <el-table-column prop="usertype" label="扫描结果下载" width="120">
          <el-button type="primary" :icon="downloadIcon" disabled="downloadEnabled">下载</el-button>
        </el-table-column>
        <el-table-column prop="usertype" label="上传分析报告" width="400">
          <template slot-scope="scope">
            <el-upload
              class="upload-demo"
              drag
              action="http://localhost:3000/upload/analysisReport/JS"
              :data="scope.row"
              :limit="1"
              :on-preview="handleAnalysisPreview"
              :on-exceed="handleAnalysisExceed"
              :before-remove="beforeAnalysisRemove"
              :on-success="handleAnalysisSuccess"
              :file-list="scope.row.analysisReportList"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">请上传代码分析报告</div>
            </el-upload>
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
          :page-sizes="[5, 10, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPageCount"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { Promise } from "q";
export default {
  data() {
    return {
      tableData: [],
      rowData: {
        SystemName: "",
        scan_src: "",
        scan_report_first: "",
        scan_report: "",
        analysis_report_first: "",
        analysis_report: ""
      },
      cur_page: 1,
      pageSize: 5,
      totalPageCount: 0,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      idx: -1,
      rowx: {},
      downloadEnabled: false,
      downloadIcon: "el-icon-download",
      fileInfo: {},
      successFileInfo: {},
      successFileList: [],
      responseData: {}
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
            data.SystemName.toLowerCase().includes(
              this.select_word.toLowerCase()
            )
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 获取系统清单表数据
    getData() {
      //alert('用户名:' + localStorage.getItem('sca_username'));
      this.$axios
        .post("/upload/table/JS", {
          username: sessionStorage.getItem("sca_username"),
          role: sessionStorage.getItem('role')
        })
        .then(res => {
          this.tableData = res.data;
          this.totalPageCount = this.tableData.length;
          //注意：vue中的forEach不能使用function格式
          this.tableData.forEach((item, index) => {
            if (item.scan_src && item.scan_src_name) {
              var fileList = [
                {
                  url: item.scan_src,
                  name: item.scan_src_name
                }
              ];
              this.tableData[index].srcfileList = fileList;
            }

            if (item.analysis_report && item.analysis_report_name) {
              var analysisReportList = [
                {
                  url: item.analysis_report,
                  name: item.analysis_report_name
                }
              ];
              this.tableData[index].analysisReportList = analysisReportList;
            }

            //this.srcfileList.push(fileList);
          });
        });
    },

    //点击文件列表中已上传的文件时的钩子，此处用来下载源码
    handleSrcPreview() {
      /*       this.fileInfo = file;
      this.$axios
        .post("/upload/download", file, { responseType: "arraybuffer" })
        .then(res => {
          //var download_url = res.data;
          let blob = new Blob([res.data]);
          let url = window.URL.createObjectURL(blob);
          //alert('下载的URL：' + url);
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", file.name);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(link.href); //释放掉blob对象
        }); */
      this.$message.warning(`由于权限问题，不支持下载源码`);
    },
    //文件超出个数限制时的钩子，此处用来对源码上传的限制
    handleSrcExceed() {
      this.$message.warning(`当前限制选择 1 个文件，请删除已上传的源码`);
    },
    //删除文件之前的钩子，参数为上传的文件file和文件列表fileList，若返回 false 或者返回 Promise 且被 reject，则停止删除。
    beforeSrcRemove(file) {
      return new Promise((resolve, reject) => {
        this.$axios.post("/upload/src/delete", file).then(res => {
          if (res.data.status) {
            this.$message.success(res.data.msg);
            resolve();
          } else {
            this.$message.error(res.data.msg);
            reject();
          }
        });
      });
    },
    //文件上传成功时的钩子, response即为后台返回的全部内容
    handleSrcSuccess(response, file, fileList) {
      this.successFileList = fileList;
      this.successFileInfo = file;
      //this.$refs.srcupload.clearFiles();
      this.$message.success(response.msg);
      this.downloadIcon = "el-icon-loading";
    },

    //点击文件列表中已上传的文件时的钩子，此处用来下载分析报告
    handleAnalysisPreview(file) {
      this.fileInfo = file;
      this.$axios
        .post("/upload/download", file, { responseType: "arraybuffer" })
        .then(res => {
          //注意：由于responseType: "arraybuffer"的作用导致返回的数据都是buffer类型，不是json，所以无法通过res.data.*去获取对应的返回数据
          this.responseData = res.data;
          let blob = new Blob([res.data]);
          let url = window.URL.createObjectURL(blob);
          //alert('下载的URL：' + url);
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", file.name);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(link.href); //释放掉blob对象
        });
    },
    //文件超出个数限制时的钩子，此处用来对分析报告上传的限制
    handleAnalysisExceed() {
      this.$message.warning(`当前限制选择 1 个文件，请删除已上传的源码`);
    },
    //删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。
    beforeAnalysisRemove(file) {
      return new Promise((resolve, reject) => {
        this.$axios.post("/upload/analysis/delete", file).then(res => {
          if (res.data.status) {
            this.$message.success(res.data.msg);
            resolve();
          } else {
            this.$message.error(res.data.msg);
            reject();
          }
        });
      });
    },
    //文件上传成功时的钩子, response即为后台返回的全部内容
    handleAnalysisSuccess(response) {
      this.$message.success(response.msg);
    },
    filterTag(value, row) {
      return row.tag === value;
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