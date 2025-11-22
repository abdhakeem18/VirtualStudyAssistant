import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Retrieves and deserializes data from AsyncStorage.
 */
export async function getData(name) {
  const dataStr = await AsyncStorage.getItem(name);
  return dataStr ? JSON.parse(dataStr) : null;
}

/**
 * Stores data in AsyncStorage with JSON serialization.
 */
export async function setData(name, data) {
  await AsyncStorage.setItem(name, JSON.stringify(data));
}

/**
 * Updates a specific field in stored data object.
 */
export async function updateDataField(name, key, value) {
  const dataStr = await AsyncStorage.getItem(name);
  const data = dataStr ? JSON.parse(dataStr) : {};
  data[key] = value;
  await AsyncStorage.setItem(name, JSON.stringify(data));
}

/**
 * Removes a specific item from AsyncStorage.
 */
export async function removeData(name) {
  await AsyncStorage.removeItem(name);
}