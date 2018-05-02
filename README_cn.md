# el-form-dialog

> A tool to make [el-dialog](http://element.eleme.io/#/en-US/component/dialog) and [el-form](http://element.eleme.io/#/en-US/component/form) work eaiser, especially for creating dialog to support two states, such as `add` and `edit`.

[Demo](https://njleonzhang.github.io/el-form-dialog/)

[Demo code](https://github.com/njleonzhang/el-form-dialog/tree/master/play)

[En Doc](https://github.com/njleonzhang/el-form-dialog/blob/master/README.md)
## Why?

1. confirm和cancel按钮<br/>
[element-ui](http://element.eleme.io/)的[dialog](http://element.eleme.io/#/zh-CN/component/dialog)
本身是不带按钮的, 需要通过slot去添加。这个设计本身没有问题，组件分离的很开。但是实际使用了缺带来了不便，主要是这里的2个按钮一般一个项目都是一样的，但是却要不断的写这段`slot = footer`代码，感觉很是烦躁。
    ```
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    ```
2. validate操作<br/>
就是和[el-form](http://element.eleme.io/#/zh-CN/component/form)一起用的时候，每次点击确定键的时候都要去对表带做validate, 每次点取消都要对validate的提示做清除, 这些代码也是要不断重复的。
3. 两种状态的dialog<br/>
一个典型的场景是我们一个页面，经常会需要新增和编辑一个数据，这是就需要添加和修改2个dialog。而这2个dialog一般来说是比较相似的，如果分别写一个dialog来处理，逻辑上自然是简单的，但是缺凭空多出很多重复代码来，运行时也多1倍的组件实例。但是如果把添加和修改dialog做成一个往往又需要处理组件的重用的逻辑复杂性，而这些处理大体上是十分相似的。
4. loading
当`confirm`按钮被点击的时候，多数情况下，我们会发起一个http请求去处理一些业务逻辑，这就会涉及到loading加载器的处理。

这个库对`el-dialog`和`el-form`做了一些封装处理以上问题，让大家可以轻松上阵，专注自己的业务逻辑。

## 使用

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

对于一个添加和修改的dialog，我们实际上只关心需要关心一下几点：

1. dialog里form (form的展示、数据、validate等)
2. dialog在添加时和修改时的title
3. dialog上确定和取消按钮的label
4. 点击完成后，得到新的数据，并通知我们处理。 (取消暂时只是关闭dialog，无法自定义)

### 步骤1: 创建form
第一步我们需要创建一个form:

```
<template>
  <el-form :model='data' :rules='rules' ref='form'>   // model属性一定要是 data, el-form 一定要有ref并且设置为for
    <el-form-item label="科目" prop="type">
      <el-input v-model="data.type"></el-input>
    </el-form-item>
    <el-form-item label="类名" prop="name">
      <el-input v-model="data.name"></el-input>
    </el-form-item>
    <el-form-item label="事件" prop="name">
      <el-input v-model="data.time"></el-input>
    </el-form-item>
    <div v-if="!this.inStateOne">                         // 如果是编辑dialog的话多显现一些内容
      南京动物园
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
        type: [             // 定义el-form的validate规则，点击dialog确认按钮的时候，会自动调用
          { required: true, message: '名称不能为空！', trigger: 'blur' },
          { max: 5, message: '岗位名称过长，请修改！', trigger: 'blur' },
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
        zoo: '南京'
      }
    },
    _setData(data) {        // optional
      this.data = {
        ...data,
        zoo1: '南京'
      }
    }
  }
}
</script>
```

这个form与一般的element-ui的[el-form](http://element.eleme.io/#/zh-CN/component/form)相比，没什么太多的不同，只是这几个字段要特别注意一下。

| 属性 | vue property 类型 | 必要么 | 作用 |
| --- | -- | -- | -- |
| inStateOne | props | 非必须 | 如果为form加了这个属性，这可以根据这个属性去处理两种dialog的不同, 见上例中`v-if="!this.inStateOne"`的使用 |
| defaultData | data/computed | 必须 | 打开添加Dialog时表格里的默认值，如果值是固定的用data声明定义即可。如果defaultData不固定需要动态生成，则可以使用computed来计算, 见上路中`defaultData`的使用 |
| data | data | 必须 | 组件库内部使用，设置成`{}`就行, 对应于el-form 的 model字段 |
| _getData | methods | 非必须 | 用于在点击confirm时，处理返回的数据 |
| _setData | methods | 非必须 | 对传入的数据做一些处理的hook |

> 另外，特别要注意`el-form`一定要有一个ref属性，并且值设置为`form`
> 当外部的数据结构和form里的不同时，可以利用_getData和_setData这2个hook去做前置和后置的处理。

###  步骤2: 创建Dialog
使用`createFormDialog`来创建Dialog
```
import { createFormDialog } from 'el-form-dialog'

createFormDialog(config: Config, mixin: VueMixin) : (form: VueConstructor) => VueConstructor

inteface Config {
  confirm? = (data) => void,  // 配合vuex使用时，用于定义回调confirm点击后的回调
  stateOneTitle? = '添加',          // 添加dialog时的title
  stateTwoTitle? = '编辑',         // 编辑dialog时的title
  confirmText? = '确定',       // 确认按钮的label
  cancelText? = '取消'         // 取消按钮的label
}
```

`createFormDialog`的第一个参数是Config类型的，它提供一系列的配置项。
> 其中`confirm`函数，用作处理Dialog确认的回调，**在这个函数里this被绑定为生成的Dialog对象**，所以在这个函数里可以调用Dialog对象上的方法。

第二个参数是一个Vue的mixin, 用于深度定制化生成的Dialog组件, 一般配合vuex来使用。

`createFormDialog`返回一个函数，这个函数接受一个我们上一步创建的包含`el-form`的Vue组件作为参数，返回的则是我们需要的Dialog组件，最终得到的这个Dialog的具体参数如下：

* props

| 属性 | 作用 |
| --- | -- |
| inStateOne | true的时候Dialog为状态1的Dailog, false时为状态2的Dialog，默认为true |
| loading | 具有.sync后缀。true的时候确认按钮处于loading状态。 |
| visible | 具有.sync后缀。true的时候显示Dialog |
| data | 传入数据，供编辑Dialog展示 |

* event

| 属性 | payload | 描述 |
| --- | -- | -- |
| confirm | el-form里的数据 | 点击Dialog确认时发出 |

* 对象方法

| 属性 | 描述 |
| --- | -- |
| closeDialog | 关闭Dialog |
| showLoading | 将confirm button置为loading状态 |
| showLoading | 将confirm button置为非loading状态 |

### 步骤3: 使用Dialog

Dialog可能会被用于配合vuex使用或者不和vuex一起使用。这两种场景下Dialog在创建和使用的时候会有所不同.

#### 配合vuex使用Dialog

配合vuex使用的时候，建议在`createFormDialog`第一个参数的confirm函数里处理来confirm点击的业务逻辑。并通过`this`来调用实例上的`closeDialog`，`showLoading`和`showLoading`来控制UI的呈现。

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
      // 主要的业务逻辑
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
      this.closeDialog() // 关闭Dialog
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
// 业务逻辑在vux层完成了，使用Dialog的时候，只需要处理Dialog的打开，并为编辑模式提供初始值即可。
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

#### 不和vuex组使用
对于小的项目，也许并不使用vuex，此时业务逻辑就需要在使用Dialog的时候处理了。

```
// AnimalFormDialog.vue

// Dailog的创建变得简单，因为不需要处理业务逻辑了。
import AnimalForm from './AnimalForm'
import { createFormDialog } from '@/index'

export default createFormDialog({
  stateOneTitle: 'add animal',
  stateTwoTitle: 'edit animal'
})(AnimalForm)
```

```
// Dialog的代码变得复杂, 需要多传递一个loading的props, 来控制loading状态。
// 业务逻辑的逻辑，则通过监听confirm事件来处理。

<template>
  <div>
    <el-button @click="addAnimal">add animal</el-button>
    <el-button @click="editAnimal">edit animal</el-button>

    <animal-form-dialog
      :in-state-one='adding'
      :visible.sync='animalDialogOpen'
      :loading.sync='loading'   // 与vuex配合使用的时候不需要此props.
      :data='animalData'
      @confirm='confirmAnimal'> // 与vuex配合使用的时候也不需要监听此事件.
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
