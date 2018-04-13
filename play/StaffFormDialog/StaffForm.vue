<template>
  <el-form :model='data' :rules='rules' ref='form'>
    <el-form-item label="名称" prop="name">
      <el-input v-model="data.name"></el-input>
    </el-form-item>
    <el-form-item label="年龄" prop="age">
      <el-input v-model="data.age"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      defaultData: {
        name: '',
        age: ''
      },
      data: {},
      rules: {
        name: [
          { required: true, message: '名称不能为空！', trigger: 'blur' },
          { max: 5, message: '岗位名称过长，请修改！', trigger: 'blur' },
        ]
      }
    }
  }
}
</script>
