import CommonDialogHOC from '@/CommonDialogHoc'
import FormInDialogHOC from './FormInDialogHOC'

export default (
  {
    confirm = null,
    titleSuffix = ''
  } = {},
  mixin = {}
) => {
  return (Component) => {
    let HOC = CommonDialogHOC(FormInDialogHOC(Component))

    return {
      props: {
        adding: Boolean,
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
        title = this.adding ? `添加${titleSuffix}` : `编辑${titleSuffix}`

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
