import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import MainLayout from "./components/layout/MainLayout";
import { useNavigation } from "@react-navigation/native";
import Summary from "./components/common/Summary";
import { getData, setData } from "./components/utils/storage";
import API from "../config/api";

export default function DetailsScreen({ route }) {
  const navigation = useNavigation();
  const { title } = route.params || {};
  const [expandedFileId, setExpandedFileId] = useState(null);
  const [dropdownStep, setDropdownStep] = useState("summary"); // 'summary', 'flashcard', 'qa'
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
            const summaries = doc.summaries ? JSON.parse(doc.summaries) : {};
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
                  <View className="bg-white border border-gray-200 rounded-md mt-2 p-3">
                    {dropdownStep === "summary" && (
                      <>
                        <Summary summary={item.summary} />
                        <View className="flex flex-row space-x-2 mb-2">
                          <TouchableOpacity
                            className="flex-1 bg-purple-900 rounded-md px-3 py-2 mr-2"
                            onPress={() =>
                              navigation.navigate("FlashCard", {
                                docId: item.document_id,
                              })
                            }
                          >
                            <Text className="text-white text-center">
                              See Flash Card
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            className="flex-1 bg-purple-900 rounded-md px-3 py-2"
                            onPress={() =>
                              navigation.navigate("QAScreen", {
                                docId: item.document_id,
                              })
                            }
                          >
                            <Text className="text-white text-center">
                              See Q&A
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    )}
                  </View>
                )}
              </View>
            )}
          />
        </View>
      </View>
    </MainLayout>
  );
}
