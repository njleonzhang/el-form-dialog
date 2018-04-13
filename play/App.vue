<template>
  <div id="app">
    <el-button @click="addStaff">add</el-button>
    <el-button @click="editStaff">edit</el-button>
    <staff-form-dialog
      :adding='adding'
      :visible.sync='dialogOpen'
      :data='data'>
    </staff-form-dialog>
  </div>
</template>

<script>
import StaffFormDialog from './StaffFormDialog'

export default {
  name: 'App',
  components: {
    StaffFormDialog
  },
  data() {
    return {
      dialogOpen: false,
      adding: false,
      data: {
        name: 'Leon',
        age: '10'
      }
    }
  },
  methods: {
    addStaff() {
      this.adding = true
      this.dialogOpen = true
      console.log(this.dialogOpen)
    },
    editStaff() {
      this.adding = false
      this.dialogOpen = true
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
