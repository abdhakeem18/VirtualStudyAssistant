import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getData(name) {
  const dataStr = await AsyncStorage.getItem(name);
  return dataStr ? JSON.parse(dataStr) : null;
}

export async function setData(name, data) {
  await AsyncStorage.setItem(name, JSON.stringify(data));
}

export async function updateDataField(name, key, value) {
  const dataStr = await AsyncStorage.getItem(name);
  const data = dataStr ? JSON.parse(dataStr) : {};
  data[key] = value;
  await AsyncStorage.setItem(name, JSON.stringify(data));
}

export async function removeData(name) {
  await AsyncStorage.removeItem(name);
}