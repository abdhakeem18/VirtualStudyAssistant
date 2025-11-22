import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import * as Speech from "expo-speech";

export default function Summary({
  summary,
  data,
  fullHeight = false,
  item,
  navigation,
  setExpandedFileId,
}) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Support both APIs: data object (for tests) or direct props (for app)
  const summaryTitle = data?.title;
  const summaryText =
    data?.summary ||
    summary ||
    "This is a dummy summary. It provides a brief overview of the uploaded material, including key points and important concepts covered in the file.";
  const keyPoints = data?.keyPoints || [];

  const playAudio = async () => {
    try {
      if (isSpeaking) {
        await Speech.stop();
        setIsSpeaking(false);
      } else {
        setIsSpeaking(true);
        Speech.speak(summaryText, {
          onDone: () => setIsSpeaking(false),
          onStopped: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false),
        });
      }
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
    }
  };

  return (
    <View
      style={{
        backgroundColor: "white",
        padding: 24,
        borderRadius: 12,
        width: "90%",
        maxHeight: fullHeight ? "80%" : "90%",
        minHeight: fullHeight ? "70%" : "auto",
      }}
    >
      <View className="flex-row justify-between items-center">
        <Text className="mb-4 text-black font-bold text-lg">
          {summaryTitle || "Summary:"}
        </Text>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            style={{ 
              backgroundColor: isSpeaking ? "#dc3545" : "#7c3aed", 
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            onPress={playAudio}
            activeOpacity={0.8}
          >
            <MaterialIcons 
              name={isSpeaking ? "stop" : "volume-up"} 
              size={18} 
              color="white" 
              style={{ marginRight: 6 }}
            />
            <Text style={{ color: "white", fontWeight: "600", fontSize: 14 }}>
              {isSpeaking ? "Stop" : "Listen"}
            </Text>
          </TouchableOpacity>
          {setExpandedFileId && (
            <TouchableOpacity
              onPress={() => setExpandedFileId(null)}
              activeOpacity={0.7}
              style={{
                padding: 4,
              }}
            >
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ScrollView
        className="flex-1 my-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        testID="summary-scroll"
      >
        <Text className="mb-2 text-gray-700 leading-6">{summaryText}</Text>

        {keyPoints.length > 0 && (
          <View className="mt-4">
            <Text className="font-semibold mb-2">Key Points:</Text>
            {keyPoints.map((point, index) => (
              <Text key={index} className="mb-1 text-gray-700">
                • {point}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>

      {item && navigation && (
        <View className="flex flex-row w-full px-4 mt-10">
          <TouchableOpacity
            className="flex-1 bg-purple-950 rounded-md px-3 py-2 mr-2"
            onPress={() => {
              setExpandedFileId(null);
              navigation.navigate("FlashCard", {
                docId: item.document_id,
              });
            }}
          >
            <Text className="text-white text-center">See Flash Card</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-purple-950 rounded-md px-3 py-2"
            onPress={() => {
              setExpandedFileId(null);
              navigation.navigate("QAScreen", {
                docId: item.document_id,
              });
            }}
          >
            <Text className="text-white text-center">See Q&A</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
