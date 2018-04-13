<template>
  <div id="app">
    <el-button @click="addStaff">add staff</el-button>
    <el-button @click="editStaff">edit staff</el-button>
    <el-button @click="addAnimal">add animal</el-button>
    <el-button @click="editAnimal">edit animal</el-button>
    <staff-form-dialog
      :adding='adding'
      :visible.sync='dialogOpen'
      :data='data'>
    </staff-form-dialog>

    <animal-form-dialog
      :adding='adding'
      :visible.sync='animalDialogOpen'
      :loading.sync='loading'
      :data='animalData'
      @confirm='confirmAnimal'>
    </animal-form-dialog>
  </div>
</template>

<script>
import StaffFormDialog from './StaffFormDialog'
import AnimalFormDialog from './AnimalFormDialog'
import { sleep } from './tool'

export default {
  name: 'App',
  components: {
    StaffFormDialog,
    AnimalFormDialog
  },
  data() {
    return {
      dialogOpen: false,
      adding: false,
      data: {
        name: 'Leon',
        age: '10'
      },
      animalDialogOpen: false,
      animalData: {
        type: '猫科',
        name: '老虎'
      },
      loading: false
    }
  },
  methods: {
    addStaff() {
      this.adding = true
      this.dialogOpen = true
    },
    editStaff() {
      this.adding = false
      this.dialogOpen = true
    },
    addAnimal() {
      this.adding = true
      this.animalDialogOpen = true
    },
    editAnimal() {
      this.adding = false
      this.animalDialogOpen = true
    },
    async confirmAnimal(data) {
      this.loading = true
      await sleep(1000)
      this.loading = false
      this.animalDialogOpen = false
      if (this.adding) {

      } else {
        this.animalData = data
      }
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
