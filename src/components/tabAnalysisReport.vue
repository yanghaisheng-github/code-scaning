<template>
  <el-table
    :data="tableData"
    border
    style="width: 100%"
    :row-class-name="tableRowClassName"
    @cell-mouse-enter="handleCellMouseEnter"
    @cell-mouse-leave="handleCellMouseOut"
    @cell-dblclick="handleCelldblClick"
  >
    <el-table-column prop="system_name_id" label="序号" width="80" align="center"></el-table-column>
    <el-table-column prop="category" label="代码安全缺陷类别" width="180" align="center">
      <template slot-scope="scope">
        <span v-if="!scope.row.celleditable || !columnEditable[0]">{{ scope.row.category }}</span>
        <span v-else>
          <el-input
            type="textarea"
            autosize
            class="cell-edit-input"
            v-model="scope.row.category"
            @change="inputValueChange(scope.row)"
          ></el-input>
        </span>
        <span v-show="scope.row.cellmouseEnter" style="margin-left:10px;" class="cell-icon">
          <i class="el-icon-edit"></i>
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="level" label="该类别缺陷风险级别" width="180" align="center">
      <template slot-scope="scope">
        <span v-if="!scope.row.celleditable || !columnEditable[1]">{{ scope.row.level }}</span>
        <span v-else>
          <el-select
            v-model="scope.row.level"
            placeholder="请选择"
            @change="inputValueChange(scope.row)"
          >
            <el-option
              v-for="(item, index) in levelOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </span>
        <span v-show="scope.row.cellmouseEnter" style="margin-left:10px;" class="cell-icon">
          <i class="el-icon-edit"></i>
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="count" label="该类别缺陷数量" align="center">
      <template slot-scope="scope">
        <span v-if="!scope.row.celleditable || !columnEditable[2]">{{ scope.row.count }}</span>
        <span v-else>
          <el-input
            class="cell-edit-input"
            v-model="scope.row.count"
            @change="inputValueChange(scope.row)"
          ></el-input>
        </span>
        <span v-show="scope.row.cellmouseEnter" style="margin-left:10px;" class="cell-icon">
          <i class="el-icon-edit"></i>
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="conditions" label="缺陷修复情况" align="center">
      <template slot-scope="scope">
        <span v-if="!scope.row.celleditable || !columnEditable[3]">{{ scope.row.conditions }}</span>
        <span v-else>
          <el-select
            v-model="scope.row.conditions"
            placeholder="请选择"
            @change.self="inputValueChange(scope.row)"
          >
            <el-option
              v-for="(item, index) in conditionsOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </span>
        <span v-show="scope.row.cellmouseEnter" style="margin-left:10px;" class="cell-icon">
          <i class="el-icon-edit"></i>
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="repairtime" label="计划修复时间" align="center">
      <template slot-scope="scope">
        <span v-if="!scope.row.celleditable || !columnEditable[4]">{{ scope.row.repairtime }}</span>
        <span v-else>
          <el-input
            class="cell-edit-input"
            v-model="scope.row.repairtime"
            @change="inputValueChange(scope.row)"
          ></el-input>
        </span>
        <span v-show="scope.row.cellmouseEnter" style="margin-left:10px;" class="cell-icon">
          <i class="el-icon-edit"></i>
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="explains" label="判断工具误报理由说明/具体防御措施说明" align="center">
      <template slot-scope="scope">
        <el-popover
          placement="left"
          trigger="click"
          @show="initPop('explains', scope.row.system_name_id, systemName)"
        >
          <froalaEditor
            :ref="'explainsEditor-' + scope.$index"
            :rowAnalysisInfo="scope.row"
            whichRtf="explains"
            :systemNameali="systemName"
            :froalaContents="popData"
          ></froalaEditor>
          <el-link type="success" slot="reference">
            查看详情
            <i class="el-icon-view el-icon--right"></i>
          </el-link>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column prop="example" label="防御措施代码举例（附相关代码或代码片段截图）" align="center">
      <template slot-scope="scope">
        <el-popover
          placement="left"
          trigger="click"
          @show="initPop('example', scope.row.system_name_id, systemName)"
        >
          <froalaEditor
            :ref="'exampleEditor-' + scope.$index"
            :rowAnalysisInfo="scope.row"
            whichRtf="example"
            :systemNameali="systemName"
            :froalaContents="popData"
          ></froalaEditor>
          <el-link type="success" slot="reference">
            查看详情
            <i class="el-icon-view el-icon--right"></i>
          </el-link>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column prop="mark" label="架构师备注" align="center">
      <template slot-scope="scope">
        <el-popover
          placement="left"
          trigger="click"
          @show="initPop('mark', scope.row.system_name_id, systemName)"
        >
          <froalaEditor
            :ref="'markEditor-' + scope.$index"
            :rowAnalysisInfo="scope.row"
            whichRtf="mark"
            :systemNameali="systemName"
            :froalaContents="popData"
          ></froalaEditor>
          <el-link type="success" slot="reference">
            查看详情
            <i class="el-icon-view el-icon--right"></i>
          </el-link>
        </el-popover>
      </template>
    </el-table-column>
  </el-table>
</template>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

<script>
import froalaEditor from "./RTFFroala";
export default {
  name: "tabAnalysisReport",
  props: ["codeType", "systemName"],
  data() {
    return {
      tableData: [],
      rowName: {
        system_name_id: "",
        category: "",
        level: "",
        count: "",
        conditions: "",
        repairtime: "",
        explains: "",
        example: "",
        mark: "",
        celleditable: false,
        cellmouseEnter: false
      },
      popData: "",
      rows: {},
      colums: {},
      // 表示是否是插入第一行
      newSystemName: 0,
      // 该数组分别表示category、level、count、conditions、repairtime，对列判断是否可以编辑
      columnEditable: [false, false, false, false, false],
      levelOptions: [
        { label: "Critical", value: "Critical" },
        { label: "High", value: "High" },
        { label: "Medium", value: "Medium" },
        { label: "Low", value: "Low" }
      ],
      conditionsOptions: [
        { label: "待修复", value: "待修复" },
        { label: "已修复", value: "已修复" },
        { label: "工具误报", value: "工具误报" },
        { label: "已通过其他方式规避", value: "已通过其他方式规避" }
      ]
    };
  },
  components: {
    froalaEditor
  },
  created() {
    this.getData();
  },
  watch: {
    // 监控是否是第一次为这个项目插入数据
    newSystemName: function() {
      this.tableData.push({
        system_name: this.systemName,
        system_name_id: 1,
        category: "",
        level: "",
        count: 0,
        conditions: "",
        repairtime: "",
        explains: "",
        example: "",
        mark: "",
        celleditable: false,
        cellmouseEnter: false
      });
      this.$axios
        .post("/tabAnalysisReport/simpleInputUpdate", {
          type: "insert",
          system_name: this.systemName,
          system_name_id: 1,
          category: "",
          level: "",
          count: 0,
          conditions: "",
          repairtime: "",
          explains: "",
          example: "",
          mark: ""
        })
        .then(res => {
          if (res.data.status === 1) this.$message.success(res.data.msg);
          else this.$message.error("新增失败");
        });
    }
  },
  methods: {
    tableRowClassName({ row }) {
      /*       if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return ""; */
      if (row.level === "Critical") {
        return "warning-row";
      } else if (row.level === "High") {
        return "success-row";
      }
      return "";
    },

    getData() {
      this.$axios
        .post("/tabAnalysisReport", {
          systemName: this.systemName,
          codeType: this.codeType
        })
        .then(res => {
          this.tableData = res.data;
          if (this.tableData.length === 0) {
            this.newSystemName = 1;
          }
          this.tableData.forEach(item => {
            item.celleditable = false;
            item.cellmouseEnter = false;
          });
        });
    },
    //当代码安全缺陷类别至计划修复时间的5个简单值发生改变时触发
    inputValueChange: function(row) {
      //判断缺陷数量字段是否输入的是数字
      let reg = /^\d{1,}$/;
      if (!reg.test(row.count)) {
        this.$message.error(`请输入数字`);
        row.count = 0;
        return;
      }
      this.$axios
        .post("/tabAnalysisReport/simpleInputUpdate", {
          type: "update",
          system_name: this.systemName,
          system_name_id: row.system_name_id,
          category: row.category,
          level: row.level,
          count: row.count,
          conditions: row.conditions,
          repairtime: row.repairtime
        })
        .then(res => {
          if (res.data.status === 1) this.$message.success(res.data.msg);
          else this.$message.error("更新失败");
        });
      //新增一空白行
      if (row.system_name_id === this.tableData.length) {
        let rowDt = {
          type: "insert",
          system_name: this.systemName,
          system_name_id: this.tableData.length + 1,
          category: "",
          level: "",
          count: 0,
          conditions: "",
          repairtime: "",
          explains: "",
          example: "",
          mark: "",
          celleditable: false,
          cellmouseEnter: false
        };
        this.tableData.push(rowDt);
        this.$axios
          .post("/tabAnalysisReport/simpleInputUpdate", rowDt)
          .then(res => {
            if (res.data.status === 1) this.$message.success(res.data.msg);
            else this.$message.error("新增失败");
          });
      }
    },
    //当某个单元格被双击击时会触发该事件
    handleCelldblClick: function(row, column) {
      //不会被刷新，目前通过改变数值的方法进行一次刷新
      (this.rows = row), (this.colums = column);
      row.cellmouseEnter = false;
      row.celleditable = true;
      ["category", "level", "count", "conditions", "repairtime"].forEach(
        (v, i) => {
          if (column.property === v) this.columnEditable[i] = true;
          else this.columnEditable[i] = false;
        }
      );

      //愚蠢的办法，后面再想其他方法进行刷新
      let foolish = row.system_name_id;
      row.system_name_id = -1;
      row.system_name_id = foolish;
    },
    //当单元格 hover 进入时会触发该事件
    handleCellMouseEnter: function(row) {
      //不会被刷新，目前通过改变数值的方法进行一次刷新
      row.cellmouseEnter = true;

      //愚蠢的办法，后面再想其他方法
      let foolish = row.system_name_id;
      row.system_name_id = -1;
      row.system_name_id = foolish;
    },
    //当单元格 hover 退出时会触发该事件
    handleCellMouseOut: function(row) {
      row.celleditable = false;
      row.cellmouseEnter = false;
    },

    initPop: function(whichRtf, system_name_id, systemName) {
      this.$axios
        .post("/tabAnalysisReport/rtfHtml", {
          whichRtf: whichRtf,
          system_name_id: system_name_id,
          system_name: systemName
        })
        .then(res => {
          //this.contents = res.data;
          if (whichRtf == "explains") this.popData = res.data[0].explains;
          if (whichRtf == "example") this.popData = res.data[0].example;
          if (whichRtf == "mark") this.popData = res.data[0].mark;
          //一定要加，因为当popData为null时，不会触发popData更改
          if(!this.popData){
            this.popData = '';
          }
          //console.log(this.popData);
        });
    }
  }
};
</script>

<style>
.el-popover {
  height: 80%;
  overflow: auto;
}
</style>

