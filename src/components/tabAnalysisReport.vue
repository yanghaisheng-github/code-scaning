<template>
  <el-table :data="tableData" border style="width: 100%" :row-class-name="tableRowClassName">
    <el-table-column prop="category" label="代码安全缺陷类别" width="180" align="center"></el-table-column>
    <el-table-column prop="level" label="该类别缺陷风险级别" width="180" align="center"></el-table-column>
    <el-table-column prop="count" label="该类别缺陷数量" align="center"></el-table-column>
    <el-table-column prop="condition" label="缺陷修复情况" align="center"></el-table-column>
    <el-table-column prop="repairtime" label="计划修复时间" align="center"></el-table-column>
    <el-table-column prop="explain" label="判断工具误报理由说明/具体防御措施说明"></el-table-column>
    <el-table-column prop="example" label="防御措施代码举例（附相关代码或代码片段截图）"></el-table-column>
    <el-table-column prop="mark" label="架构师备注" align="center"></el-table-column>
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
export default {
  name: "tabAnalysisReport",
  props: ["codeType", "systemName"],
  data() {
    return {
      tableData: [],
      rowName: {
        category: "",
        level: "",
        count: "",
        condition: "",
        repairtime: "",
        explain: "",
        example: "",
        mark: ""
      }
    };
  },
  created() {
    this.getData();
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
        .post("/tabExcelReport", {
          systemName: this.systemName,
          codeType: this.codeType
        })
        .then(res => {
          this.tableData = res.data;
        });
    }
  }
};
</script>