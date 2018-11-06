import Txcel from './txcel/Txcel'

Txcel.install = function lamda(Vue) {
  Vue.component(Txcel.name, Txcel)
}

export default Txcel
