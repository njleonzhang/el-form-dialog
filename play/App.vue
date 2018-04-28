<template>
  <div id="app">
    <el-button @click="addStaff">add staff</el-button>
    <el-button @click="editStaff">edit staff</el-button>
    <el-button @click="addAnimal">add animal</el-button>
    <el-button @click="editAnimal">edit animal</el-button>
    <staff-form-dialog
      :in-state-one='adding'
      :visible.sync='dialogOpen'
      :data='data'>
    </staff-form-dialog>

    <animal-form-dialog
      :in-state-one='adding'
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
      data: {},
      datas: [
        {
          name: 'Leon',
          age: '10'
        },
        {
          name: 'candy',
          age: '9'
        }
      ],
      animalDialogOpen: false,
      animalData: {
        type: '猫科',
        name: '老虎',
        time: new Date('1987')
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
      this.data = this.datas[Math.random() < 0.5 ? 0 : 1]
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
      console.log(data)
      this.$message(data)
      this.loading = true
      await sleep(1000)
      // your business logic here
      if (this.adding) {

      } else {
        this.animalData = data
      }
      this.loading = false
      this.animalDialogOpen = false
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
