<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>

    <el-row class="row-add">
      <el-col :span="24">
        <el-button type="success" plain @click="$router.push({name: 'goods-add'})">添加商品</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      stripe
      border
      :data="list"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格"
        width="180">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量"
        width="180">
      </el-table-column>
      <el-table-column
        prop="add_time"
        label="创建时间"
        width="180">
        <template slot-scope="scope">
          {{ scope.row.add_time | fmtDate('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit"></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 添加分类对话框 -->
    <!-- <el-dialog title="添加分类" :visible.sync="addFormDialog">
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="分类名称" label-width="100px" prop="cat_name">
          <el-input v-model="addForm.cat_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" label-width="100px">
          <el-cascader
            expand-trigger="hover"
            :options="options"
            change-on-select
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
    </el-dialog> -->
    <!-- /添加分类对话框 -->

    <!-- 编辑分类对话框 -->
    <!-- <el-dialog title="编辑分类" :visible.sync="editFormDialog">
      <el-form :model="editForm" ref="addForm">
        <el-form-item label="分类名称" label-width="100px" prop="cat_name">
          <el-input v-model="editForm.cat_name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </div>
    </el-dialog> -->
    <!-- /编辑分类对话框 -->
  </el-card>
</template>

<script>
import ElTreeGrid from 'element-tree-grid';

export default {
  data() {
    return {
      list: [],
      loading: true,
      pagenum: 1,
      pagesize: 5,
      total: 0
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      const { data: resData } = await this.$http({
        url: '/goods',
        method: 'get',
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      this.loading = false;
      const { data, meta } = resData;
      if(meta.status == 200) {
        this.list = data.goods;
        this.total = data.total;
      } else {
        this.$message.warning('获取信息失败');
      }
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.loadData();
    },

    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
    }
  },
  components: {
    ElTreeGrid
  }
};
</script>

<style>
.row-add {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>