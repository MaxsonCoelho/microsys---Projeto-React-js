import AsyncStorage from '@react-native-community/async-storage';
import { NavigationActions } from 'react-navigation';

export async function getUser() {
  try {
    return await AsyncStorage.getItem('@ListApp:userToken');
  } catch (e) {
    throw e;
  }
}

export async function storeUser(userToken) {
  try {
    return await AsyncStorage.setItem('@ListApp:userToken', JSON.stringify(userToken));
  } catch (e) {
    throw e;
  }
}//

export async function saveUser(user){
  try {
    await AsyncStorage.setItem('@ListApp:userToken', JSON.stringify(user))

  } catch (e) {
    console.log(e)
  }
}

//

export default async function getSession(){
  return JSON.parse( await AsyncStorage.getItem('@ListApp:session'))

}

export async function deleteUser() {
  try {
    return await AsyncStorage.removeItem('@ListApp:userToken');
  } catch (e) {
    throw e;
  }
}

