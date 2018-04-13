import StaffForm from './StaffForm'
import { FormDialog } from '@/index'
import { sleep } from '../tool'

export default FormDialog({
  async confirm(data) {
    this.loading = true
    // simulate a http request
    await sleep(1000)
    this.loading = false
    this.$message(`name: ${data.name}, age: ${data.age}`)
    // update data here with vuex
    this.closeDialog()
  },
  titleSuffix: 'staff'
})(StaffForm)
