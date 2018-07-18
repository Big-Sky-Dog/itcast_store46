<template>
    <el-card class="box-card">
   <!-- 面包屑 -->
      <my-breadcrumb level1="商品管理" level2="商品分类"></my-breadcrumb>

    <el-row class="row-add">
      <el-col :span="24">
        <el-button type="success" plain @click="handleShowAdd">添加分类</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      stripe
      border
      :data="list"
      style="width: 100%">
      
      <!-- tree grid
        treeKey 绑定到id，给每一个节点设置一个唯一值
        parentKey 绑定到父id属性，区分父子节点
        levelKey 绑定到层级的属性 
        childKey 绑定到存储子元素的属性
       -->
      <el-tree-grid
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children"
        :indentSize="30">
      </el-tree-grid>
      <!-- <el-table-column
        prop="cat_name"
        label="分类名称"
        width="180">
      </el-table-column> -->
      <el-table-column
        label="级别"
        width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否有效">
        <template slot-scope="scope">
          {{ scope.row.cat_deleted ? '无效' : '有效' }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit" @click="handleShowEdit(scope.row)"></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    
    <!-- 添加分类 -->
    <el-dialog title="添加分类" :visible.sync="addFormDialog">
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="分类名称" label-width="100px" prop="cat_name">
          <el-input v-model="addForm.cat_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" label-width="100px">
          <el-cascader
            expand-trigger="hover"
            :options="options"
            change-on-select
            clearable
            placeholder="默认是一级分类"
            :props="{
              label: 'cat_name',
              value: 'cat_id',
              children: 'children'
            }"
            v-model="selectedOptions2">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
  
    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editFormDialog">
      <el-form :model="editForm" ref="addForm">
        <el-form-item label="分类名称" label-width="100px" prop="cat_name">
          <el-input v-model="editForm.cat_name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import ElTreeGrid from 'element-tree-grid';
export default {
  data() {
    return{
      list: [],
      loading: true,
      pagenum: 1,
      pagesize: 5,
      total: 0,
      addFormDialog: false,
      editFormDialog: false,
      addForm: {
        cat_name: ''
      },
      editForm: {
        cat_name: ''
      },
      selectedOptions2: [],
      options: []
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      const res = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      this.loading = false;
      const {data : {result, total}} = res.data;
      this.list = result;
      this.total = total;
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
    },
    async handleShowAdd() {
      this.addFormDialog = true;
      const res = await this.$http.get('categories',{type: 2})
      this.options = res.data.data;
    },
    async handleAdd() {
      let catPid = 0;
      if (this.selectedOptions2[0]) {
        catPid = this.selectedOptions2[this.selectedOptions2.length - 1];
      }
      const fromData = {
        ...this.addForm,
        cat_pid: catPid,
        cat_level: this.selectedOptions2.length
      }
      const res = await this.$http.post('categories', fromData)
      console.log(res)
      if(res.data.meta.status == 201) {
        this.addFormDialog = false;
        this.$refs['addForm'].resetFields();
        this.selectedOptions2 = [];
        this.loadData();
        this.$message.success('添加成功');
      } else {
        this.$message.error(res.data.meta.msg)
      }
    },
    async handleDelete(cat) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`categories/${cat.cat_id}`)
        const { meta } = res.data;
        if (meta.status === 200) {
          this.$message.success('删除成功');
          this.loadData();
        } else {
          this.$message.error('删除失败');
        }
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    handleShowEdit(cat) {
      this.editForm = cat;
      this.editFormDialog = true;
    },
    async handleEdit() {
      const {cat_id, cat_name} = this.editForm;
      const res = await this.$http.put(`categories/${cat_id}`, {cat_name})
      console.log(res);
      const {meta} = res.data;
      if(meta.status == 200) {
        this.$message.success(meta.msg);
        this.loadData();
        this.editFormDialog = false;
      } else {
        this.$message.error(meta.msg);
      }
    }
  },
  components: {
    ElTreeGrid
  }
}
</script>

<style>
  .row-add {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
