import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MainLayout from "./components/layout/MainLayout";
import Svg, { Line, Marker, Path } from "react-native-svg";
import { getData } from "./components/utils/storage";
import API from "../config/api";

export default function FlashCardScreen({ route, navigation }) {
  const docId = route?.params?.docId || 0;
  const [flashcards, setFlashcards] = useState([]);
  const [showAnswer, setShowAnswer] = useState({}); // { [id]: true/false }
  const [message, setMessage] = useState("");

  const handleToggleAnswer = (id) => {
    setShowAnswer((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const fetchSummary = async () => {
      setMessage("");

      try {
        const apiv = API("v1");
        const response = await apiv.get(`/flashcard/get/${docId}`);
        if (response.data.success) {
          setFlashcards(response.data?.flashcards || []);
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
  }, [docId]);

  // For demo: fixed card height and spacing
  const CARD_HEIGHT = 64;
  const CARD_MARGIN = 12;
  const svgHeight = flashcards.length * (CARD_HEIGHT + CARD_MARGIN);

  return (
    <MainLayout>
      <View className="flex-1 px-4 pb-14">
        <Text className="font-bold text-lg text-slate-700 mb-4">
          Flash Cards
        </Text>
        <View style={{ position: "relative", flex: 1 }}>
          {/* SVG arrows between cards */}
          <Svg
            height={svgHeight}
            width="100%"
            style={{ position: "absolute", left: 0, top: CARD_HEIGHT / 2 }}
            pointerEvents="none"
          >
            {flashcards.map((item, idx) => {
              if (idx === flashcards.length - 1) return null;
              const y1 = idx * (CARD_HEIGHT + CARD_MARGIN) - 10;
              const y2 = (idx + 1) * (CARD_HEIGHT + CARD_MARGIN) - 28;
              return (
                <Line
                  key={item.id + "-arrow"}
                  x1="50%"
                  y1={y1}
                  x2="50%"
                  y2={y2}
                  stroke="#a21caf"
                  strokeWidth={3}
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
            {/* <Marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="5"
              refY="5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <Path d="M 0 0 L 10 5 L 0 10 z" fill="#a21caf" />
            </Marker> */}
          </Svg>
          <DraggableFlatList
            data={flashcards}
            onDragEnd={({ data }) => setFlashcards(data)}
            keyExtractor={(item) => item.id}
            renderItem={({ item, drag, isActive, index }) => (
              <TouchableOpacity
                className="py-4 px-1 bg-gray-100 mb-3 rounded-md min-w-[100%]"
                style={{
                  backgroundColor: isActive ? "#e9d5ff" : "#f3f4f6",
                  marginBottom: CARD_MARGIN,
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  height: "auto",
                }}
                onLongPress={drag}
                onPress={() => handleToggleAnswer(item.id)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="drag"
                  size={24}
                  style={{ color: "#a21caf", marginRight: 12 }}
                />
                <View>
                  <Text
                    className={`${item.question.length > 55 ? "max-w-[95%]" : ""} pr-2 font-bold text-gray-800`}
                  >
                    {item.question}
                  </Text>
                  {showAnswer[item.id] && (
                    <Text className="text-gray-600 mt-2">{item.answer}</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        <Text className="text-xs text-gray-400 mt-4">
          (Tap a card to show/hide the answer. Drag and drop to rearrange.
          Arrows are for demo only.)
        </Text>
      </View>
    </MainLayout>
  );
}
