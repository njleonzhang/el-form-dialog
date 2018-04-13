<template>
  <el-form :model='data' :rules='rules' ref='form'>
    <el-form-item label="科目" prop="type">
      <el-input v-model="data.type"></el-input>
    </el-form-item>
    <el-form-item label="类名" prop="name">
      <el-input v-model="data.name"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      defaultData: {
        type: '',
        name: ''
      },
      data: {},
      rules: {
        type: [
          { required: true, message: '名称不能为空！', trigger: 'blur' },
          { max: 5, message: '岗位名称过长，请修改！', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    getData() {
      return {
        ...this.data,
        zoo: '南京'
      }
    }
  }
}
</script>
