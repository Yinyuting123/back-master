<template>
  <el-row>
    <CategorySelector 
        @getCategoryId="getCategoryId" 
        :show="!isShowTable"/>
    <el-card style="margin-top: 10px">
        <el-row v-show="isShowTable">
            <el-button 
                type="primary" 
                icon="el-icon-plus"
                :disabled="!category3Id" 
                @click="addAttr">添加属性</el-button>
            <el-table :data="attrList" style="width: 100%">
                <el-table-column type="index" label="序号" width="width">
                </el-table-column>
                <el-table-column 
                    prop="attrName" 
                    label="属性名称" 
                    width="width">
                </el-table-column>
                <el-table-column 
                    prop="attrValueList" 
                    label="属性值列表" 
                    width="width">
                    <template slot-scope="scope">
                        <el-tag 
                            size="medium"
                            v-for="attr in scope.row.attrValueList"
                            :key="attr.id"
                            style="margin: 0px 10px"
                            >{{ attr.valueName }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column 
                    label="操作" 
                    width="width">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="editAttr(scope.row)">编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                    </template>
                </el-table-column>
            </el-table> 
        </el-row>
        <el-row :gutter="20" v-show="!isShowTable">
            <el-form 
                ref="attrForm" 
                :model="attrForm" 
                :rules="rules"
                label-width="80px">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-form-item 
                            prop="attrName"
                            label="属性名">
                            <el-input v-model="attrForm.attrName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-button 
                            type="primary" 
                            icon="el-icon-plus"
                            :disabled="!attrForm.attrName" 
                            @click="addAttrValue">添加属性值</el-button>
                        <el-button @click="isShowTable = true">取消</el-button>
                    </el-col>
                </el-row>
                <el-row :gutter="10" style="margin-left: 15px">
                    <el-col :span="16">
                        <el-table 
                            :data="attrForm.attrValueList"
                            border>
                            <el-table-column 
                                type="index"
                                label="序号"
                                width="100">
                            </el-table-column>
                            <el-table-column 
                                prop="valueName"
                                label="属性值名称"
                                max-width="180">
                                <template slot-scope="{row, $index}">
                                    <el-form-item
                                        :rules="rules.valueName"
                                        :prop="'attrValueList.' + $index + '.valueName'"
                                        label-width="auto">
                                        <el-input
                                            v-model="row.valueName" 
                                            v-if="row.flag" 
                                            :ref="$index"
                                            size="mini"
                                            @blur="toLook(row)"
                                            @keyup.native.enter="toLook(row)"></el-input>
                                        <span 
                                            v-else
                                            @click="toEdit(row, $index)"
                                            style="display: block">{{row.valueName}}</span>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="prop"
                                label="操作" >
                                <template slot-scope="scope">
                                    <el-button 
                                        type="danger" 
                                        icon="el-icon-delete" 
                                        size="mini"
                                        @click="deleteRow(scope.row, scope.$index)"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <el-row :gutter="10" style="margin-left: 15px;margin-top: 15px">
                    <el-col :span="8">
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('attrForm')">保存</el-button>
                            <el-button @click="isShowTable = true">取消</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        
                    </el-col>
                </el-row>
            </el-form>
            
            
        </el-row>
    </el-card>
  </el-row>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";

export default {
  name: "Attr",

  data() {
    return {
      attrList: [],
      category1Id: "",
      category2Id: "",
      category3Id: "",
      isShowTable: true,
      attrForm: {
        attrName: '',
        attrValueList: [
          //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
        ],
        categoryId: 0, //三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      },
      rules: {
        attrName: [{required: true, message: '属性名不能为空', trigger: 'blur'}],
        valueName: [{ required: true, message: '请输入属性值', trigger: 'blur'}]
      }
    };
  },

  mounted() {},

  methods: {
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        this.category2Id = ""
        this.category3Id = ""
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = ""
      } else {
        this.category3Id = categoryId;
        this.getAttrList();
      }
    },
    async getAttrList() {
      let { category1Id, category2Id, category3Id } = this;
      let result = await this.$api.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    editAttr(row) {
        this.isShowTable = false
        this.attrForm = cloneDeep(row)
        this.attrForm.attrValueList.forEach(item => {
            this.$set(item, 'flag', false)
        })
    },
    toEdit(row, index) {
        row.flag = true
        //获取input节点，实现自动聚焦
        //需要注意：点击span的时候，切换为input变为编辑模式，但是需要注意，对于浏览器而言，页面重绘与重排耗时间的
        //点击span的时候，重绘重排一个input它是需要耗费时间，因此我们不可能一点击span立马获取到input
        //$nextTick,当节点渲染完毕了，会执行一次
        this.$nextTick(() => {
            this.$refs[index].focus()
        })
    },
    toLook(row) {
        if(row.valueName !== '') {
            row.flag = false
        }
    },
    addAttrValue() {
        this.attrForm.attrValueList.push({
            valueName: '',
            flag: true,
            attrId: this.attrForm.id 
        })

        this.$nextTick(() => {
            this.$refs[this.attrForm.attrValueList.length - 1].focus()
        })
    },
    addAttr() {
        this.isShowTable = false
        this.attrForm = {
            attrName: '',
            attrValueList: [],
            categoryId: this.category3Id,
            categoryLevel: 3
        }
    },
    deleteRow(row, index) {
        this.$confirm(`确定要删除属性值${row.valueName}吗？`, '确认信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }).then(() => {
            this.attrForm.attrValueList.splice(index, 1)
        }).catch(() => {
            
        })
    },
    submitForm() {
        this.$refs['attrForm'].validate((valid) => {
            if(valid) {
                if(this.attrForm.attrValueList.length <= 0) {
                    this.$message({
                        message: '请添加属性值',
                        type: 'warning'
                    })
                }
                this.addOrUpdateAttr()
            }
        })
    },
    async addOrUpdateAttr() {
        try {
            await this.$api.attr.reqAddOrUpdateAttr(this.attrForm)
            this.isShowTable = true
            this.$message({
                message: '保存成功',
                type: 'success'
            })
            this.getAttrList()
        } catch(error) {
            this.$message.error('保存失败！')
        }
    }
  },
};
</script>

<style lang="scss" scoped>
</style>