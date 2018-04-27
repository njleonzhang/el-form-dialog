import AnimalForm from './AnimalForm'
import { createFormDialog } from '@/index'

export default createFormDialog({
  stateOneTitle: 'add animal',
  stateTwoTitle: 'edit animal'
})(AnimalForm)
