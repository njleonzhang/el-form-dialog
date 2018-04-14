/*
  fake usage with vuex
*/

import StaffForm from './StaffForm'
import { createFormDialog } from '@/index'
import { sleep } from '../tool'

/*
sample code

import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('staffs')
*/

export default createFormDialog(
  {
    addTitle: 'add staff',
    editTitle: 'edit staff',
    async confirm(data) {
      this.showLoading()
      // simulate a http request
      await sleep(1000)
      /*
      sample code

      try {
        if (this.adding) {
          await this.add()
        } else {
          await this.edit()
        }
      } catch (e) {
        console.log(e)
      }
      */
      this.hideLoading()
      this.$message(`name: ${data.name}, age: ${data.age}`)
      console.log(data)

      this.closeDialog()
    }
  },
  {
    methods: {
      /*
      sample code

      ...mapActions([
        'add',
        'update'
      ])
      */
    }
  }
)(StaffForm)
