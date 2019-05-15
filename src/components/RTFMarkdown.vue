<template>
  <div>
    <div class="container">
      <div class="plugins-tips">
        <h3>【代码安全缺陷类别/该类别缺陷风险级别/该类别缺陷数量/缺陷修复情况】</h3>
        <h3>{{rowAnalysisInfo.category}} {{rowAnalysisInfo.level}} {{rowAnalysisInfo.count}} {{rowAnalysisInfo.conditions}}</h3>
      </div>
      <mavon-editor
        v-model="content"
        ref="md"
        @imgAdd="$imgAdd"
        @imgDel="$imgDel"
        @change="change"
      />
      <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";

export default {
  name: "markdown",
  props: ["rowAnalysisInfo", "whichRtf"],
  data: function() {
    return {
      content: "",
      html: "",
      img_file: {},
      configs: {}
    };
  },
  components: {
    mavonEditor
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {},

    // 将图片上传到服务器，返回地址替换到md中
    $imgAdd(pos, $file) {
      // 缓存图片信息
      //alert($file);
      //console.log("===============add file===================");
      this.img_file[pos] = $file;
     //console.log(this.img_file);
    },
    // file是数组，位置0表示上面的pos，位置1表示上面的$file
    $imgDel(file) {
      //console.log("===============delete file===================");
      delete this.img_file[file[0]];
      //console.log(this.img_file);
    },
    change(value, render) {
      // render 为 markdown 解析后的结果
      this.html = render;
    },
    submit() {
      //console.log(this.content);
      //console.log(this.html);
      //this.$message.success("提交成功！");
      let formdata = new FormData();
      // 添加富文本中文字内容
      formdata.append("textContent", this.content);
      // 添加富文本中的图片内容
      for (var _img in this.img_file) {
        formdata.append(_img, this.img_file[_img]);
      }
      //alert(formdata.get('1'));
      // 上传富文本
      this.$axios
        .post("/tabAnalysisReport/imgupload", formdata)
        .then(res => {
          /**
           * 例如：返回数据为 res = [[pos, url], [pos, url]...]
           * pos 为原图片标志（0）
           * url 为上传后图片的url地址
           */
          // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
          for (var img in res) {
            this.$refs.md.$img2Url(img[0], img[1]);
          }
        });
    }
  }
};
</script>
<style scoped>
.editor-btn {
  margin-top: 20px;
}
</style>