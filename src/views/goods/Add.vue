<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品添加"></my-breadcrumb>

    <el-row class="row-add">
    </el-row>

        <!-- 步骤条 -->
    <el-steps :active="stepActive" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>

    <!-- 标签页 -->
    <el-tabs tab-position="left" v-model="activeName" @tab-click="handleTabClick">
	    <el-tab-pane label="基本信息" name="0">
        <el-form ref="form" :model="form" label-width="80px" label-position="top">
	        <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <CategoryCascader type="3" @myevent="handleMouse"></CategoryCascader>
          </el-form-item>
          <!-- <el-form-item>
            <el-button type="primary" @click="handleAdd">立即创建</el-button>
            <el-button>取消</el-button>
          </el-form-item> -->
        </el-form>
        <el-button @click="handleNextStep">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="1">
          <!--
          上传组件封装的非常完整，你只要告诉它把图片上传到哪个接口路径就可以了
          action 用来指定图片上传的地址
          上传组件跟你的 axios 没有任何关系，所以你在 axios 中配置的基准路径在这里是无效
          所以 action 我们要写完整的 url 路径
          on-preview 预览图片的时候触发
          on-remove 删除列表图片的时候触发
          file-list 存储上传的图片数组
            {name: xxx, url: xxx}
          由于上传组件不是使用的 axios 发出的请求，所以你在 axios 中配置的请求拦截器也是无效的
          所以 token 也就没有，需要我们自己来配置，使用 headers 属性
         -->
        <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          :on-preview="handlePreview"
          :headers="headers"
          :on-remove="handleRemove"
          :file-list="fileList2"
          :on-success="handleUploadSuccess"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-row>
          <el-col :span="4">
            <el-button @click="handleNextStep">下一步</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="商品详情" name="2">
        <quill-editor
          v-model="form.goods_introduce"
          ref="myQuillEditor"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @ready="onEditorReady($event)">
        </quill-editor>
        <el-row  style="margin-top: 75px;">
          <el-col :span="4">
            <el-button type="primary" @click="handleAdd">立即创建</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import CategoryCascader from '@/components/CategoryCascader'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  data () {
    return {
      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: '',
        goods_introduce: '',
        pics: []
      },
      activeName: '0',
      stepActive: 0,
      fileList2: [],
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      }
    };
  },
  created () {
  },
  methods: {
    async handleAdd() {
      const res = await this.$http.post('goods', this.form)
      const {data, meta} = res.data;
      if(meta.status == 201) {
        this.$message.success(meta.msg);
      } else {
        this.$message.error(meta.msg);
      }
    },
    handleMouse(data) {
      this.form.goods_cat = data.join(',');
    },
    onEditorBlur () {
      console.log('onEditorBlur')
    },
    onEditorFocus () {
      console.log('onEditorFocus')
    },
    onEditorReady () {
      console.log('onEditorReady')
    },
    handleNextStep() {
       this.activeName = Number.parseInt(this.activeName) + 1 + '';
       this.stepActive
    },
    handleTabClick(tab, event) {
      this.stepActive = tab.index - 0;
    },
    handleRemove(file, fileList) {
      // 把数组中某个元素的 pic === file.response.data.tmp_path 元素移除

      // 数组的 findIndex 方法用来遍历数组
      // 没遍历一次就执行一次回调函数
      // 在回调函数中执行 item.pic === file.response.data.tmp_path 判定条件
      // 如果判定就结果为 true，则停止遍历，返回该元素的索引
      // 如果遍历到最后都没有 true，则返回 -1
      // 还有一个方法 find，和 findIndex 类似，一个返回索引，一个返回元素
      const index = this.form.pics.findIndex(function (item) {
        return item.pic === file.response.data.tmp_path;
      });

      if (index !== -1) {
        // splice 方法可以删除数组元素，从 index 开始（包含 index），删除 1 个
        this.form.pics.splice(index, 1);
      }
    },
    handlePreview(file) {
      console.log(file);
    },
    handleUploadSuccess(response, file, fileList) {
      this.form.pics.push({
        pic: response.data.tmp_path
      });
    }
  },
  components: {
    CategoryCascader,
    quillEditor
  }
};
</script>

<style>
.row-add {
  margin-top: 10px;
  margin-bottom: 10px;
}
.quill-editor {
  height: 300px;
  margin-bottom: 15px;
}
</style>