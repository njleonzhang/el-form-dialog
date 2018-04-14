import CommonDialogHOC from '@/CommonDialogHoc'
import FormInDialogHOC from './FormInDialogHOC'

export default (
  {
    confirm = null,
    addTitle = '添加',
    editTitle = '编辑',
    confirmText = '确定',
    cancelText = '取消'
  } = {},
  mixin = {}
) => {
  return (Component) => {
    let HOC = CommonDialogHOC(confirmText, cancelText)(FormInDialogHOC(Component))

    return {
      props: {
        adding: {
          default: true,
          type: Boolean
        },
        loading: Boolean
      },
      data() {
        return {
          innerLoading: false
        }
      },
      watch: {
        loading(val) {
          this.innerLoading = val
        }
      },
      methods: {
        confirm(data) {
          confirm && confirm.call(this, data)
          this.$emit('confirm', data)
        },
        closeDialog() {
          this.$emit('update:visible', false)
        },
        updateLoading(loading) {
          this.$emit('update:loading', loading)
        },
        showLoading() {
          this.innerLoading = true
          this.updateLoading(true)
        },
        hideLoading() {
          this.innerLoading = false
          this.updateLoading(false)
        }
      },

      mixins: [
        mixin
      ],

      render() {
        let { title, ...attrs } = this.$attrs
        title = this.adding ? addTitle : editTitle

        return (
          <HOC { ...{attrs: attrs} }
            { ...{on: {...this.$listeners, confirm: this.confirm}} }
            adding={ this.adding }
            title={ title }
            loading={ this.innerLoading }/>
        )
      },
      components: {
        HOC
      }
    }
  }
}
