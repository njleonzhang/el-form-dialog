/*
  fake usage with vuex
*/

import StaffForm from './StaffForm'
import { FormDialog } from '@/index'
import { sleep } from '../tool'

/*
sample code

import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('staffs')
*/

export default FormDialog(
  {
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
    },
    titleSuffix: 'staff'
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
