import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons, FontAwesome6 } from "@expo/vector-icons";
import Card from "./components/common/Card";
import MainLayout from "./components/layout/MainLayout";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import API from "../config/api";
import { getData } from "./components/utils/storage";

const HomeScreen = () => {
  const [AddMaterial, setAddMaterial] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroup, setNewGroup] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [cards, setCards] = useState([]);
  const [message, setMessage] = useState("");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });
    if (result.assets && result.assets.length > 0) {
      const picked = result.assets[0];
      setFileUploaded(picked);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const user = await getData("user");
      setMessage("");

      const apiv = API("v1");
      const response = await apiv.get("/document/get");
      if (response.data.success) {
        const uniqueGroups = Array.from(
          new Set(response.data.documents.map((g) => g.group))
        );
        setGroups(uniqueGroups);
        setCards(uniqueGroups);
      } else {
        setMessage({
          error: response.data.message || "Password change failed.",
        });
      }
    } catch (err) {
      console.log('err => ', err);
      setMessage({ error: err.message || "Network error. Please try again." });
    }
  };

  const getRandomImage = (num) => {
    const mathImages = [
      require("../assets/images/cover-img1.png"),
      require("../assets/images/cover-img2.png"),
      require("../assets/images/cover-img3.png"),
      require("../assets/images/cover-img4.png"),
      require("../assets/images/cover-img5.png"),
      require("../assets/images/cover-img6.png"),
      require("../assets/images/cover-img7.png"),
    ];

    if (num < 7) {
      return mathImages[num];
    }
    return mathImages[Math.floor(Math.random() * 7)];
  };

  const saveMaterial = async () => {
    setMessage("");
    setLoading(true);
    if (!fileUploaded || !newTitle || !selectedGroup) {
      setMessage({ error: "Please fill in all fields." });
      setLoading(false);
      return;
    }

    try {
      const apiv = API("v1");
      const formData = new FormData();

      formData.append("title", newTitle);
      formData.append("group", selectedGroup);
      formData.append("file", {
        uri: fileUploaded.uri,
        name: fileUploaded.name,
        type: fileUploaded.mimeType || "application/octet-stream",
      });

      const response = await apiv.post("/document/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setAddMaterial(false);
        setFileUploaded(false);
        setNewTitle("");
        setSelectedGroup("");
        setNewGroup("");
        await fetchDocuments();
        setMessage({ success: "Material generated successfully!" });
      } else {
        setMessage({ error: response.data.message || "Upload failed" });
      }
    } catch (err) {
      console.log("Upload error:", err);
      setMessage({ error: err.message || "Network error. Please try again." });
    }
    setLoading(false);
  };

  return (
    <MainLayout goBack={false} message={message} setMessage={setMessage}>
      <View className="items-end w-100 px-4 my-3">
        <TouchableOpacity
          onPress={() => {
            setAddMaterial(!AddMaterial);
          }}
          className="bg-purple-900 px-4 py-3 rounded-xl shadow-md flex-row items-center space-x-2"
        >
          <Text className="text-white font-semibold text-center">
            <FontAwesome6 name="plus" size={16} color="white" /> New Material
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex flex-row w-full flex-1 px-4 pb-14">
        <View className="w-full pr-4 flex-1">
          <Text className="font-bold text-lg text-slate-700 mb-2">
            My Materials
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            className="space-y-4"
            style={{ flex: 1 }}
          >
            {cards.length > 0 ? (
              <>
                {cards.map((card, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() =>
                      navigation.push("MaterialDetails", { title: card })
                    }
                  >
                    <Card title={card} imageSource={getRandomImage(i)} />
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <View className="flex items-center justify-center h-full mt-20">
                <MaterialCommunityIcons
                  name="book-education"
                  size={300}
                  color="#e6e6e6"
                />
                <Text className="text-gray-500 text-lg mt-4">
                  lets add some materials!
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>

      <View
        className={`absolute z-20 w-full h-full top-0 left-0 bg-transparent shadow-lg ${AddMaterial ? "" : "hidden"}`}
      >
        <View className=" bg-black opacity-80 w-full h-full"></View>
        <View className="flex items-center justify-center w-11/12 h-auto z-10 absolute bg-white m-5 top-1/4 px-2 py-10">
          {loading ? (
            <View className="absolute inset-0 h-full flex items-center justify-center bg-black bg-opacity-50 ">
              <Text className="text-white">Generating your material...</Text>
            </View>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => setAddMaterial(false)}
                className="absolute top-4 right-4"
              >
                <MaterialCommunityIcons name="close" size={24} color="black" />
              </TouchableOpacity>
              <Text className="text-black font-bold mb-10 text-3xl w-full border-b-2 border-gray-200 pb-7 text-center">
                New Material
              </Text>

              {/* File upload field */}

              <View className="flex flex-col items-center mb-4 bg-slate-200 pt-10 p-4 w-10/12">
                <View className="w-50 h-50 absolute top-4 right-4">
                  {fileUploaded && (
                    <TouchableOpacity
                      onPress={() => {
                        setFileUploaded(false);
                        setSelectedGroup("");
                        setNewTitle("");
                        setNewGroup("");
                      }}
                    >
                      <MaterialCommunityIcons
                        name="delete"
                        size={24}
                        color="red"
                      />
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity
                  className="flex flex-col items-center mb-4 "
                  onPress={pickDocument}
                >
                  <MaterialCommunityIcons
                    name="file-document-outline"
                    size={25}
                    color="black"
                  />
                  <Text className="mb-2 text-black text-center">
                    {fileUploaded ? fileUploaded.name : "No file uploaded"}
                  </Text>
                </TouchableOpacity>
              </View>

              {fileUploaded && (
                <>
                  <View className="w-full items-center">
                    <Text className="mb-2 text-black">
                      Select Material Title
                    </Text>
                    <View className=" rounded-md w-10/12 mb-2">
                      <TextInput
                        className="border border-gray-300 rounded-md px-2 py-1  mb-4 h-12"
                        value={newTitle}
                        onChangeText={setNewTitle}
                        placeholder="Title"
                      />
                      <Picker
                        selectedValue={selectedGroup}
                        style={{
                          height: 55,
                          width: "100%",
                          backgroundColor: "#f0f0f0",
                        }}
                        onValueChange={(itemValue) => {
                          if (itemValue === "add_new") {
                            setShowAddGroup(true);
                          } else {
                            setSelectedGroup(itemValue);
                            setShowAddGroup(false);
                          }
                        }}
                      >
                        <Picker.Item label="Select a group..." value="" />
                        {groups.map((group, idx) => (
                          <Picker.Item key={idx} label={group} value={group} />
                        ))}
                        <Picker.Item label="Add new...." value="add_new" />
                      </Picker>
                    </View>

                    {showAddGroup && (
                      <View className=" w-full items-center mb-2">
                        <Text className="mb-1 text-black">New Group Name</Text>
                        <View className=" w-full mb-2 flex-row justify-center">
                          <TextInput
                            className="border border-gray-300 rounded-md px-2 py-1 w-8/12 mb-2 h-12"
                            value={newGroup}
                            onChangeText={setNewGroup}
                            placeholder="Enter group name"
                          />
                          <TouchableOpacity
                            className="bg-purple-900 px-4 py-2 rounded-md w-2/12 items-center h-12"
                            onPress={() => {
                              if (newGroup.trim()) {
                                setGroups([...groups, newGroup.trim()]);
                                setSelectedGroup(newGroup.trim());
                                setShowAddGroup(false);
                              }
                            }}
                          >
                            <MaterialCommunityIcons
                              name="plus"
                              size={24}
                              color="white"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    className="bg-purple-900 px-4 py-2 w-4/12 rounded-md mt-3"
                    onPress={saveMaterial}
                  >
                    <Text className="text-white text-center">Save</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}
        </View>
      </View>
    </MainLayout>
  );
};

export default HomeScreen;
