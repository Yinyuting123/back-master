<template>
  <el-row>
    <el-col :span="24" style="margin-bottom: 10px">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="showDialog">添加</el-button>
    </el-col>
    <el-col>
      <el-table :data="tableData" row-key="id" border style="width: 100%">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="tmName" label="品牌名称" width="180">
        </el-table-column>
        <el-table-column prop="logoUrl" label="品牌LOGO">
          <!-- <template slot-scope="{row}">
                      <img :src="row.logoUrl" alt="" style="width: 100px;height: 100px">
                  </template> -->
          <template slot-scope="scope">
            <img
              :src="scope.row.logoUrl"
              alt=""
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" max-width="200px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="handleClick(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col style="text-align: center; margin-top: 10px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 5, 7, 10]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-col>

    <el-dialog :title="trademarkForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogVisible" width="width">
      <el-form
        style="width: 80%"
        ref="trademarkForm"
        :model="trademarkForm"
        :rules="rules">
        <el-form-item prop="tmName" label="品牌名称" label-width="100px">
          <el-input v-model="trademarkForm.tmName"></el-input>
        </el-form-item>
        <el-form-item prop="logoUrl" label="品牌LOGO" label-width="100px">
          <!-- 这里收集数据不能用v-model,因为不是表单元素 -->
          <!-- action: 设置图片上传的地址-->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkForm.logoUrl"
              :src="trademarkForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过2MB
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark">确 定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
export default {
  name: "BackMasterIndex",

  data() {
    const validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error("品牌名称在2-10位"));
      } else {
        callback();
      }
    };
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      dialogVisible: false,
      trademarkForm: {
        tmName: "",
        logoUrl: "",
      },
      rules: {
        tmName: [
          { required: true, message: "品牌名称不能为空", trigger: "blur" },
          { validator: validateTmName, trigger: "blur" },
        ],
        logoUrl: [
          { required: true, message: "品牌名称不能为空", trigger: "change" },
        ],
      },
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    async getData() {
      let { currentPage, pageSize } = this;
      let result = await this.$api.trademark.reqTrademarkList(
        currentPage,
        pageSize
      );
      console.log(result);
      if (result.code === 200) {
        this.tableData = result.data.records;
        this.total = result.data.total;
      }
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.currentPage = 1;
      this.getData();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getData();
    },
    showDialog() {
        this.dialogVisible = true
    },
    handleClick(row) {
        this.trademarkForm = { ...row }
        this.isNew = false
        this.dialogVisible = true
    },
    handleAvatarSuccess(res, file) {
      this.trademarkForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    async addOrUpdateTrademark() {
        try {

            await this.trademarkForm.id ? this.$api.trademark.reqUpdateTrademark(this.trademarkForm) 
                :this.$api.trademark.reqSaveTrademark(this.trademarkForm)
            this.dialogVisible = false
            this.$message.success(this.trademarkForm.id ?'修改品牌信息成功！' : '新增品牌信息成功！')
            this.getData()
        } catch(error) {
            this.$message.error('新增品牌失败！')
        } 
    }
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>