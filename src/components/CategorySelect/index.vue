<template>
  <el-card>
    <el-form :inline="true" ref="form" :model="form" label-width="80px">
      <el-form-item label="一级分类">
        <el-select
          v-model="form.category1Id"
          placeholder="请选择一级分类"
          :disabled="show"
          @change="handler1"
        >
          <el-option
            v-for="category in category1List"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="form.category2Id"
          placeholder="请选择二级分类"
          :disabled="show"
          @change="handler2"
        >
          <el-option
            v-for="category in category2List"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select 
          v-model="form.category3Id" 
          placeholder="请选择三级分类"
          :disabled="show"
          @change="handler3">
          <el-option
            v-for="category in category3List"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "CategorySelector",
  props: ['show'],
  data() {
    return {
      category1List: [],
      category2List: [],
      category3List: [],
      form: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },

  mounted() {
    this.getCategory1List();
  },

  methods: {
    async getCategory1List() {
      //获取一级分类的请求：不需要携带参数
      let result = await this.$api.attr.reqCategory1List();
      if (result.code == 200) {
        this.category1List = result.data;
      }
    },
    async handler1() {
      // 清除旧数据
      this.category2List = [];
      this.category3List = [];

      this.form.category2Id = ""
      this.form.category3Id = ""

      let { category1Id } = this.form;
      this.$emit('getCategoryId', {categoryId: category1Id, level: 1});

      let result = await this.$api.attr.reqCategory2List(category1Id);
      if (result.code == 200) {
        this.category2List = result.data;
      }
    },
    async handler2() {
      // 清除旧数据
      this.category3List = [];
      this.form.category3Id = ""

      let { category2Id } = this.form;
      this.$emit('getCategoryId', {categoryId: category2Id, level: 2});

      let result = await this.$api.attr.reqCategory2List(category2Id);
      if (result.code == 200) {
        this.category3List = result.data;
      }
    },
    handler3() {
        let { category3Id } = this.form;
        this.$emit('getCategoryId', {categoryId: category3Id, level: 3});
    }
  },
};
</script>

<style lang="scss" scoped>
</style>