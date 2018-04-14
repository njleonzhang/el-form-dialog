import AnimalForm from './AnimalForm'
import { createFormDialog } from '@/index'

export default createFormDialog({
  addTitle: 'add animal',
  editTitle: 'edit animal'
})(AnimalForm)
