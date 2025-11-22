import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons, FontAwesome6 } from "@expo/vector-icons";
import Card from "./components/common/Card";
import Button from "./components/common/Button";
import MainLayout from "./components/layout/MainLayout";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import API from "../config/api";
import { getData } from "../utils/storage";

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
  const [waitingTime, setWaitingTime] = useState(0);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameText, setRenameText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const navigation = useNavigation();

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
    if (cards.length <= 0) {
      fetchDocuments();
    }
  }, []);

  // Timer effect for loading countdown
  // useEffect(() => {
  //   let interval;
  //   if (loading) {
  //     setWaitingTime(0);
  //     interval = setInterval(() => {
  //       setWaitingTime((prevTime) => prevTime + 1);
  //     }, 1000);
  //   } else {
  //     setWaitingTime(0);
  //   }

  //   return () => {
  //     if (interval) {
  //       clearInterval(interval);
  //     }
  //   };
  // }, [loading]);

  const fetchDocuments = async () => {
    try {
      const user = await getData("user");
      setMessage("");

      const apiv = API("v1");
      const response = await apiv.get("/document/get");
      if (response.data.success) {
        // Create a Map to track unique groups by group name
        const groupMap = new Map();
        
        response.data.documents.forEach((doc) => {
          if (!groupMap.has(doc.group)) {
            groupMap.set(doc.group, {
              id: doc.id,
              group: doc.group
            });
          }
        });
        
        // Convert Map values to array
        const uniqueGroups = Array.from(groupMap.values());
        
        // Extract just group names for the picker
        const groupNames = uniqueGroups.map(item => item.group);

        setGroups(groupNames);
        setCards(uniqueGroups);
      } else {
        setMessage({
          error: response.data.message || "Failed to fetch documents.",
        });
      }
    } catch (err) {
      setMessage({ error: err?.message || "Network error. Please try again." });
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
      setMessage({ error: err.message || "Network error. Please try again." });
    }
    setLoading(false);
  };

  const deleteMaterial = async (cardObject) => {
    Alert.alert(
      "Delete Material",
      `Are you sure you want to delete "${cardObject.group}" and all its contents? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeleteLoading(true);
            setMessage("");
            try {
              const apiv = API("v1");
              const response = await apiv.delete(`/document/group/${encodeURIComponent(cardObject.group)}`);
              
              if (response.data.success) {
                await fetchDocuments();
                setMessage({ success: "Material deleted successfully!" });
                setShowOptionsModal(false);
                setSelectedCard(null);
              } else {
                setMessage({ error: response.data.message || "Delete failed" });
              }
            } catch (err) {
              setMessage({ error: err.message || "Network error. Please try again." });
            }
            setDeleteLoading(false);
          },
        },
      ]
    );
  };

  const renameMaterial = async () => {
    if (!renameText.trim() || renameText.trim() === selectedCard.group) {
      setMessage({ error: "Please enter a new name." });
      return;
    }

    setRenameLoading(true);
    setMessage("");
    
    try {
      const apiv = API("v1");
      const response = await apiv.put(`/document/group/rename`, {
        oldName: selectedCard.group,
        newName: renameText.trim()
      });

      if (response.data.success) {
        await fetchDocuments();
        setMessage({ success: "Material renamed successfully!" });
        setShowRenameModal(false);
        setShowOptionsModal(false);
        setSelectedCard(null);
        setRenameText("");
      } else {
        setMessage({ error: response.data.message || "Rename failed" });
      }
    } catch (err) {
      setMessage({ error: err.message || "Network error. Please try again." });
    }
    setRenameLoading(false);
  };

  const openOptionsModal = (cardTitle) => {
    setSelectedCard(cardTitle);
    setShowOptionsModal(true);
  };

  const openRenameModal = () => {
    setRenameText(selectedCard.group);
    setShowRenameModal(true);
    setShowOptionsModal(false);
  };

  return (
    <MainLayout goBack={false} message={message} setMessage={setMessage}>
      <View className="items-end w-100 px-4 my-3">
        <TouchableOpacity
          onPress={() => {
            setAddMaterial(!AddMaterial);
          }}
          className="bg-purple-950 px-4 py-3 rounded-xl shadow-md flex-row items-center space-x-2"
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
                  
                  <View key={i} className="relative">
                    <TouchableOpacity
                      onPress={() =>
                        navigation.push("MaterialDetails", { title: card.group })
                      }
                    >
                      <Card title={card.group} imageSource={getRandomImage(i)} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="absolute top-2 right-2 bg-white/80 rounded-full p-2"
                      onPress={() => openOptionsModal(card)}
                    >
                      <MaterialCommunityIcons
                        name="dots-vertical"
                        size={20}
                        color="#7c3aed"
                      />
                    </TouchableOpacity>
                  </View>
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
        <View
          className={`flex items-center justify-center w-11/12 h-auto z-10 absolute m-5 top-1/4 px-2 ${loading ? "py-1" : "py-10 bg-white"}`}
        >
          {loading ? (
            <View className="w-full h-full flex items-center justify-center bg-black opacity-85 py-8">
              <Text className="text-white font-bold text-xl mb-4">
                Generating your material...
              </Text>
              <Text className="text-white text-lg mb-2">
                Please wait while we process your document
              </Text>
              <View className="flex flex-row items-center">
                <Text className="text-white text-base">
                  Time elapsed: 
                </Text>
                <Text className="text-yellow-300 font-bold text-lg ml-2">
                  {formatTime(waitingTime)}
                </Text>
              </View>
              <Text className="text-gray-300 text-sm mt-4 text-center px-4">
                This may take a few minutes depending on document size
              </Text>
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

              {/*** File upload field ***/}

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
                            className="bg-purple-950 px-4 py-2 rounded-md w-2/12 items-center h-12"
                            onPress={() => {
                              if (newGroup.trim()) {
                                const trimmedGroup = newGroup.trim();
                                if (!groups.includes(trimmedGroup)) {
                                  setGroups([...groups, trimmedGroup]);
                                  setSelectedGroup(trimmedGroup);
                                  setShowAddGroup(false);
                                  setNewGroup("");
                                } else {
                                  setMessage({ error: "Group already exists!" });
                                }
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
                  <Button
                    name="Save"
                    callback={saveMaterial}
                    loading={loading}
                    btnCls="bg-purple-950 px-4 py-2 w-4/12 rounded-md mt-3"
                    textCls="text-white text-center"
                  />
                </>
              )}
            </>
          )}
        </View>
      </View>

      {/*** Options Modal ***/}
      {showOptionsModal && (
        <View className="absolute z-30 w-full h-full top-0 left-0 bg-transparent">
          <View className="bg-black/50 w-full h-full"></View>
          <View className="flex items-center justify-center w-4/5 h-auto z-10 absolute top-1/2 left-1/2 bg-white rounded-lg p-6" style={{ transform: [{ translateX: -150 }, { translateY: -100 }] }}>
            <TouchableOpacity
              onPress={() => {
                setShowOptionsModal(false);
                setSelectedCard(null);
              }}
              className="absolute top-4 right-4"
            >
              <MaterialCommunityIcons name="close" size={24} color="black" />
            </TouchableOpacity>
            
            <Text className="text-black font-bold mb-6 text-xl text-center">
              Material Options
            </Text>
            <Text className="text-gray-600 mb-6 text-center">
              "{selectedCard?.group}"
            </Text>

            <View className="w-full space-y-3 flex-1">
              <Button
                name="Rename Material"
                callback={openRenameModal}
                btnCls="bg-purple-950 px-4 py-3 rounded-md w-full"
                textCls="text-white text-center font-semibold"
              />
              
              <Button
                name="Delete Material"
                callback={() => deleteMaterial(selectedCard)}
                loading={deleteLoading}
                btnCls="bg-red-600 px-4 py-3 rounded-md w-full mt-3"
                textCls="text-white text-center font-semibold"
              />
              
            </View>
          </View>
        </View>
      )}

      {/*** Rename Modal ***/}
      {showRenameModal && (
        <View className="absolute z-30 w-full h-full top-0 left-0 bg-transparent">
          <View className="bg-black/50 w-full h-full"></View>
          <View className="flex items-center justify-center w-4/5 h-auto z-10 absolute top-1/2 left-1/2 bg-white rounded-lg p-6" style={{ transform: [{ translateX: -150 }, { translateY: -100 }] }}>
            <TouchableOpacity
              onPress={() => {
                setShowRenameModal(false);
                setRenameText("");
                setShowOptionsModal(true);
              }}
              className="absolute top-4 right-4"
            >
              <MaterialCommunityIcons name="close" size={24} color="black" />
            </TouchableOpacity>
            
            <Text className="text-black font-bold mb-6 text-xl text-center">
              Rename Material
            </Text>

            <View className="w-full mb-6">
              <Text className="mb-2 text-gray-600">New Name:</Text>
              <TextInput
                className="border border-gray-300 rounded-md px-3 py-3 w-full"
                value={renameText}
                onChangeText={setRenameText}
                placeholder="Enter new name"
                autoFocus={true}
              />
            </View>

            <View className="w-full space-y-3">
              <Button
                name="Save Changes"
                callback={renameMaterial}
                loading={renameLoading}
                btnCls="bg-purple-950 px-4 py-3 rounded-md w-full"
                textCls="text-white text-center font-semibold"
              />
              
              <Button
                name="Cancel"
                callback={() => {
                  setShowRenameModal(false);
                  setRenameText("");
                  setShowOptionsModal(true);
                }}
                btnCls="bg-gray-300 px-4 py-3 rounded-md w-full mt-3"
                textCls="text-gray-700 text-center font-semibold"
              />
            </View>
          </View>
        </View>
      )}
    </MainLayout>
  );
};

export default HomeScreen;
