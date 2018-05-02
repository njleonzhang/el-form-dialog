# el-form-dialog

> A tool to make [el-dialog](http://element.eleme.io/#/en-US/component/dialog) and [el-form](http://element.eleme.io/#/en-US/component/form) work eaiser, especially for creating dialog to support two states, such as `add` and `edit`.

[Demo](https://njleonzhang.github.io/el-form-dialog/)

[Demo code](https://github.com/njleonzhang/el-form-dialog/tree/master/play)

## Why?

1. confirm and cancel<br/>
[el-dialog](http://element.eleme.io/#/zh-CN/component/dialog) of [element-ui](http://element.eleme.io/) doesn't contain confirm and cancel button. Buttons need to be added to `dialog` by `slot`. It is a flexible design and split features to different components. At the same time, this design brings inconvinience and annoyance when lots of Dialog with buttons is used in the project. the following code need to be repeated again and again.

    ```
    <el-dialog
      title="title"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>some message/span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">confirm</el-button>
      </span>
    </el-dialog>
    ```
2. validate<br/>
If dialog is used with [el-form](http://element.eleme.io/#/zh-CN/component/form), then every time the `confirm` button is clicked, the data in form need to be validated, and every time the dialog is closed, the validate need to be cleared. This logic is also need to be repeated again and again.
3. dialog for 2 states<br/>
a typical scenerio is that we need dialogs to create and edit some data. most of the time, The 2 dialogs are similiar. If we write 2 standalone dialog components, it make redudant code, and dialog instance is doubled in run time. If we write 1 dialog component, then we need to handle the complexity of the 2 states.
4. loading<br/>
when `confirm` is clicked, most of the time we send a http request, which means we need to show loading and hide loading.

This library handle all the above issues for you, and make you focus on your business logic.

## Usage

```
yarn add element-ui
npm install --save-dev element-ui

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

yarn add el-form-dialog
cnpm install --save-dev el-form-dialog

import { createFormDialog } from 'el-form-dialog'
```

For a 2 state dialog, take `add` and `edit` as an example, we only care the followings:

1. the form in dialog (teamplte、data schema、validate)
2. dialog title in `add` and `edit` states
3. label of `confirm` and `cancel` buttons
4. a `event` to emit the new data. which we can listen on and do somthing with.

### Step 1: create a Form

```
Sample:

<template>
  <el-form :model='data' :rules='rules' ref='form'> // model prop must be data, el-form must have ref attribute whose value is form
    <el-form-item label="type" prop="type">
      <el-input v-model="data.type"></el-input>
    </el-form-item>
    <el-form-item label="name" prop="name">
      <el-input v-model="data.name"></el-input>
    </el-form-item>
    <el-form-item label="time" prop="time">
      <el-input v-model="data.time"></el-input>
    </el-form-item>
    <div v-if="!this.inStateOne"> // show more thing in edit state
      nanjing zoo
    </div>
  </el-form>
</template>

<script>
export default {
  props: {
    inStateOne: Boolean         // optional
  },
  data() {
    return {
      data: {},             // must
      rules: {
        type: [             // el-form validate is excuted when `confirm` button clicked.
          { required: true, message: 'type can not be empty', trigger: 'blur' },
          { max: 5, message: 'type too long', trigger: 'blur' },
        ]
      }
    }
  },
  computed: {
    defaultData() {         // must
      return {
        type: '',
        name: '',
        time: new Date()
      }
    },
  },
  methods: {
    _getData() {             // optional
      return {
        ...this.data,
        zoo: 'nanjing'
      }
    },
    _setData(data) {        // optional
      this.data = {
        ...data,
        zoo1: 'nanjing'
      }
    }
  }
}
</script>
```

This form is basically same to [el-form](http://element.eleme.io/#/zh-CN/component/form), only few specifics need you attention.

| prop | vue property type | optional | desc |
| --- | -- | -- | -- |
| inStateOne | props | optional | `inStateOne` can be leveraged to distinguish the difference of 2 state, refer to the usage of `v-if="!this.inStateOne"` in the sample |
| defaultData | data/computed | must | the data for stateOne, can be directly assigned as `data`, or genarated dymaticially as `computed` |
| data | data | must | used by the library as `model` prop of `el-form`, just set it as `{}`, |
| _getData | methods | optional | convert inner `data` to `confirm` event data if provided |
| _setData | methods | optional | convert outer or default `data` to inner `data` if provided  |

> `el-form` must have ref attribute，whose value must be `form`
> `model` prop of `el-form` must be `data`.
> when outer data schema is different to inner data, `_getData` and `_setData` can be leveraged to handle.

###  Step2: Create Dialog
使用`createFormDialog`来创建Dialog
```
import { createFormDialog } from 'el-form-dialog'

createFormDialog(config: Config, mixin: VueMixin) : (form: VueConstructor) => VueConstructor

inteface Config {
  confirm? = (data) => void,  // use with vuex, define the callback of `confirm` click
  stateOneTitle? = 'add',     // title of state one dialog (add dialog here)
  stateTwoTitle? = 'edit',    // title of state two dialog (edit dialog here)
  confirmText? = 'confirm',   // label of confirm button
  cancelText? = 'cancel'      // label of cancel button
}
```

first parameter of `createFormDialog` is of type Config. configration is stting by this parameter.
> the `confirm` is a callback function for confirm button click，**the function call is bind to the generated dialog instance**，so you can call dialog instance methods in `confirm` by `this`.

2nd parameter is a Vue mixin, which is used to customize the  generated dialog deeply. it is used with vuex in general.

`createFormDialog` returns a function, which accepts the `form components` we created in Step1 as parameter, and returns the final generated Dialog.

The generated Dialog has the following props, events and methods:

* props

| property | desc |
| --- | -- |
| inStateOne | default as true. true to indicate the Dialog is in state one, false to indicate the Dialog is in state two |
| loading | with .sync modifier. true to indicate confirm button show loading  |
| visible | with .sync modifier. true to indicate the Dialog to show |
| data | outData to show in state 2 form  |

* event

| property | payload | desc |
| --- | -- | -- |
| confirm | model of el-form | emit when confirm button is clicked and the form is valid |

* methods

| property | desc |
| --- | -- |
| closeDialog | close the Dialog |
| showLoading | make confirm button loading show |
| showLoading | make confirm button loading hide |

### 步骤3: use the generated dialog

The Dialog can be used in 2 scenerio, with-vuex or without-vuex

#### with Vuex
When the generated dialog is used with Vuex, business logic of confirm button click is suggested to implemented in `confirm` property of the first parameter `createFormDialog`. `closeDialog`，`showLoading` and `showLoading` can be leveraged to control the UI show.

```
// StaffFormDialog.js
import StaffForm from './StaffForm'

import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('staffs')

export default createFormDialog(
  {
    stateOneTitle: 'add staff',
    stateTwoTitle: 'edit staff',
    async confirm(data) {
      // logic is simple here due to vuex
      this.showLoading()
      try {
        if (this.inStateOne) {
          await this.add()
        } else {
          await this.edit()
        }
      } catch (e) {
        console.log(e)
      }

      this.hideLoading()
      this.closeDialog() // close Dialog
    }
  },
  {
    methods: {
      ...mapActions([
        'add',
        'update'
      ])
    }
  }
)(StaffForm)
```

```
// business logic is implemented in vux and `confirm`. In this senerio, just provide edit value for edit state, and change state and control the open when use the generated dialog.

<teamplte>
  <div>
    <staff-form-dialog
      :in-state-one='adding'
      :visible.sync='visible'
      :data='data'>
    </staff-form-dialog>
    <el-button @click="addStaff">add staff</el-button>
    <el-button @click="editStaff">edit staff</el-button>
  </div>
</teamplte>
<script>
  import StaffFormDialog from './StaffFormDialog'
  export default {
    name: 'App',
    components: {
      StaffFormDialog,
    },
    data() {
      return {
        visible: false,
        adding: false,
        datas: [
          {
            name: 'Leon',
            age: '10'
          },
          {
            name: 'candy',
            age: '9'
          }
        ]
        data: {}
      }
    },
    methods: {
      addStaff() {
        this.adding = true
        this.visible = true
      },
      editStaff() {
        this.data = this.datas[Math.random() < 0.5 ? 0 : 1]
        this.adding = false
        this.visible = true
      }
    }
  }
</script>
```

#### without vuex
For small project, vuex is not necessary, somtime event too heavy. we need to handle business logic when use the generated dialog.

```
// AnimalFormDialog.vue

// Dailog creat is sample, no business logic here

import AnimalForm from './AnimalForm'
import { createFormDialog } from '@/index'

export default createFormDialog({
  stateOneTitle: 'add animal',
  stateTwoTitle: 'edit animal'
})(AnimalForm)
```

```
// Dialog usage code become complex, need pass loading prop to control the loading show. event `confirm` is listened to handle the  business logic in this scenario

<template>
  <div>
    <el-button @click="addAnimal">add animal</el-button>
    <el-button @click="editAnimal">edit animal</el-button>

    <animal-form-dialog
      :in-state-one='adding'
      :visible.sync='animalDialogOpen'
      :loading.sync='loading'   // only need without vuex
      :data='animalData'
      @confirm='confirmAnimal'> // only need without vuex.
    </animal-form-dialog>
  </div>
</template>

<script>
import AnimalFormDialog from './AnimalFormDialog'

export default {
  name: 'App',
  components: {
    StaffFormDialog,
    AnimalFormDialog
  },
  data() {
    return {
      animalDialogOpen: false,
      animalData: {
        type: '猫科',
        name: '老虎'
      },
      loading: false
    }
  },
  methods: {
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
```
