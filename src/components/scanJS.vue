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
      <el-tabs type="card" editable v-model="selectedTabName" @edit="handleTabsEdit">
        <el-tab-pane
          v-for="(item, index) in editableTabs"
          :key="index"
          :label="item.title"
          :name="item.name"
        >
          <component :is="item.content" codeType="JavaScript" :systemName="systemName" @addTab="add_analysis_tab"></component>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import tabAnalysisReport from "./tabAnalysisReport";
import tabScan from "./tabScan";

export default {
  name: 'scanJava',
  data() {
    return {
      editableTabs: [
        {
          title: "JavaScript代码扫描",
          name: "1",
          content: "tabScan"
        }
      ],
      selectedTabName: "1",
      tabIndex: 1,
      systemName: ''
    };
  },
  components: {
    tabAnalysisReport,
    tabScan
  },
  methods: {
    // 点击项目名称跳转到分析报告tab页
    // 并将点击的systemName传回
    add_analysis_tab(systemName) {
      let newTabName = ++this.tabIndex + "";
      this.editableTabs.push({
        title: `${systemName}代码安全分析`,
        name: newTabName,
        content: "tabAnalysisReport"
      });
      this.selectedTabName = newTabName;
      this.systemName = systemName;
    },

    // 点击 tabs 的新增按钮或 tab 被关闭后触发
    handleTabsEdit(targetName, action) {
      //alert(`targetName: ${targetName}    action: ${action}`);
      if (action === "remove") {
        let tabs = this.editableTabs;
        let activeName = this.selectedTabName;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        this.selectedTabName = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }
    }
  }
};
</script>

<style scoped>
.table {
  width: 100%;
  font-size: 14px;
}
</style>