import { InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore } from 'vuex';


import RootStateTypes from '@/store/interface'
// import AllStateTypes from '@/store/interface'
// import userModules from '@/store/modules/user'

export default createStore<RootStateTypes>({
  state:{
    email:'',
  },
  getters:{
    email: state => state.email
  },
  mutations: {
    setEmail(state,email){
      state.email = email
    }
  },
  actions: {
    setEmail({ commit },email){
        commit('setEmail', email)
    }

  },
});

export const key:InjectionKey<Store<RootStateTypes>> = Symbol('vue-store')
export function useStore(){
  return baseUseStore(key)
}
