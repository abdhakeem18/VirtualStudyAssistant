import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import MainLayout from "./components/layout/MainLayout";
import { useNavigation } from "@react-navigation/native";
import Summary from "./components/common/Summary";
import { getData, setData } from "../utils/storage";
import API from "../config/api";

export default function DetailsScreen({ route }) {
  const navigation = useNavigation();
  const { title } = route.params || {};
  const [expandedFileId, setExpandedFileId] = useState(null);
  const [dropdownStep, setDropdownStep] = useState("summary");
  const [summary, setSummary] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      setMessage("");

      try {
        const apiv = API("v1");
        const response = await apiv.get(`/document/get/${title}`);
        let sum = [];
        if (response.data.success) {
          response.data.documents.forEach((doc) => {
            const summaries = doc.summaries ?  typeof doc.summaries === 'object'
            ? doc.summaries : JSON.parse(doc.summaries) : {};
            sum.push(summaries);
          });

          await setData("doc_summary", sum);
          setSummary(sum);
        } else {
          setMessage({
            error: response.data.message || "Failed to fetch summary",
          });
        }
      } catch (err) {
        setMessage({ error: err.message || "Failed to fetch summary" });
      }
    };
    fetchSummary();
  }, [title]);

  return (
    <MainLayout message={message} setMessage={setMessage}>
      <View className="flex flex-row w-full flex-1 px-4 pb-14">
        <View className="w-full pr-4 flex-1">
          <Text className="font-bold text-lg text-slate-700 mb-2">{title}</Text>
          <Text className="mb-4 text-gray-500">Uploaded Files:</Text>
          <FlatList
            data={summary}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
            renderItem={({ item, index }) => (
              <View className="mb-4">
                <TouchableOpacity
                  className="bg-gray-100 rounded-md px-4 py-3"
                  onPress={() => {
                    setExpandedFileId(
                      expandedFileId === item.id ? null : item.id
                    );
                    setDropdownStep("summary");
                  }}
                >
                  <Text className="text-base text-black">{item.title}</Text>
                  <Text className="text-xs text-purple-700 mt-1">
                    {expandedFileId === item.id
                      ? "Hide Options"
                      : "Show Options"}
                  </Text>
                </TouchableOpacity>
                {expandedFileId === item.id && (
                  <Modal
                    visible={expandedFileId === item.id}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setExpandedFileId(null)}
                  >
                    <View
                      className="flex-1 justify-center items-center -bottom-12"
                      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    >
                      {dropdownStep === "summary" && (
                        <View className="w-full h-full justify-center items-center px-4">
                          <Summary
                            summary={item.summary}
                            fullHeight={true}
                            setExpandedFileId={setExpandedFileId}
                            item={item}
                            navigation={navigation}
                          />
                        </View>
                      )}
                    </View>
                  </Modal>
                )}
              </View>
            )}
          />
        </View>
      </View>
    </MainLayout>
  );
}
