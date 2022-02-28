import { Module } from 'vuex'
import RootStateTypes from '@/store/interface'
import UserStateTypes from '@/store/modules/user/interface'

const userModules:Module<UserStateTypes,RootStateTypes> = {
    namespaced:process.env.NODE_ENV !== 'production',
   
}
export default userModules
