<template>
  <div class="container">
    <div class="plugins-tips">
      <h3>【系统名称/代码安全缺陷类别/该类别缺陷风险级别/该类别缺陷数量/缺陷修复情况】</h3>
      <h3>{{systemNameali}} {{rowAnalysisInfo.category}} {{rowAnalysisInfo.level}} {{rowAnalysisInfo.count}} {{rowAnalysisInfo.conditions}}</h3>
    </div>
    <froala :config="config" v-model="froalaContents"></froala>
    <el-button class="editor-btn" type="primary" @click="saveArticle">提交</el-button>
  </div>
</template>

<script>
export default {
  props: ["rowAnalysisInfo", "whichRtf", "systemNameali", "froalaContents"],
  data() {
    return {
      editor: null,
      config: {
        placeholderText: "请在这儿编辑你的内容",
        zIndex: 2501,
        height: "600",
        toolbarSticky: false,
        autofocus: true,
        toolbarButtons: [
          "fullscreen",
          "bold",
          "italic",
          "underline",
          "strikeThrough",
          "subscript",
          "superscript",
          "|",
          "fontFamily",
          "fontSize",
          "color",
          "inlineClass",
          "inlineStyle",
          "paragraphStyle",
          "lineHeight",
          "|",
          "paragraphFormat",
          "align",
          "formatOL",
          "formatUL",
          "outdent",
          "indent",
          "quote",
          "-",
          "insertLink",
          "insertImage",
          "insertVideo",
          "embedly",
          "insertFile",
          "insertTable",
          "|",
          "emoticons",
          "fontAwesome",
          "specialCharacters",
          "insertHR",
          "selectAll",
          "clearFormatting",
          "|",
          "print",
          "getPDF",
          "spellChecker",
          "help",
          "html",
          "|",
          "undo",
          "redo"
        ],
        placeholder: "请填写内容",
        language: "zh_cn",
        imageDefaultWidth: 500,
        imageMaxSize: 1024 * 1024 * 20,
        imageUploadURL: `http://localhost:3000/tabAnalysisReport/RTF/${
          this.systemNameali
        }/img`,
        videoUploadURL: `http://localhost:3000/tabAnalysisReport/RTF/${
          this.systemNameali
        }/video`,
        fileUploadURL: `http://localhost:3000/tabAnalysisReport/RTF/${
          this.systemNameali
        }/file`,
        imageManagerLoadURL: `http://localhost:3000/tabAnalysisReport/RTF/${
          this.systemNameali
        }/img`,
        requestHeaders: {
          Authorization: localStorage.getItem("Authorization")
        },
        events: {
          "froalaEditor.initialized": (e, editor) => {
            this.editor = editor;
          }
          /*           // 图片上传回调
          "froalaEditor.image.uploaded": (e, editor, res) => {
            const response = JSON.parse(res);
            this.eventsService.emitMessageEvent(
              response.State == 1
                ? this.eventsService.eventNames.EVENT_TOAST_SUCCESS
                : this.eventsService.eventNames.EVENT_TOAST_ERROR,
              response.Message
            );
          } */
        }
      }
    };
  },
  methods: {
/*     setHtml(html) {
      if (this.editor) {
        this.editor.html.set(html);
      }
    }, */
/*     //返回html数据
    getData() {
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
        });
    }, */
    saveArticle() {
      // 上传富文本
      this.$axios
        .post("/tabAnalysisReport/rtfupload", {
          htmlContent: this.froalaContents,
          system_name_id: this.rowAnalysisInfo.system_name_id,
          system_name: this.systemNameali,
          whichRtf: this.whichRtf
        })
        .then(res => {
          if (res.data.status == 1) this.$message.success(res.data.msg);
        });
    }
  }
};
</script>