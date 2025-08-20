import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MainLayout from "./components/layout/MainLayout";
import Svg, { Line, Marker, Path } from 'react-native-svg';

const dummyFlashcards = [
  { id: '1', front: 'What is x?', back: 'x is a variable.' },
  { id: '2', front: 'Solve for y: 2y+3=7', back: 'y=2' },
  { id: '3', front: 'What is a variable?', back: 'A symbol for a number we don’t know yet.' },
];

export default function FlashCardScreen({ route, navigation }) {
  const [data, setData] = useState(dummyFlashcards);
  const [showAnswer, setShowAnswer] = useState({}); // { [id]: true/false }

  const handleToggleAnswer = (id) => {
    setShowAnswer((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // For demo: fixed card height and spacing
  const CARD_HEIGHT = 64;
  const CARD_MARGIN = 12;
  const svgHeight = data.length * (CARD_HEIGHT + CARD_MARGIN);

  return (
    <MainLayout>
      <View className="flex-1 px-4 pb-14">
        <Text className="font-bold text-lg text-slate-700 mb-4">Flash Cards</Text>
        <View style={{ position: 'relative', flex: 1 }}>
          {/* SVG arrows between cards */}
          <Svg
            height={svgHeight}
            width="100%"
            style={{ position: 'absolute', left: 0, top: CARD_HEIGHT / 2 }}
            pointerEvents="none"
          >
            {data.map((item, idx) => {
              if (idx === data.length - 1) return null;
              const y1 = idx * (CARD_HEIGHT + CARD_MARGIN);
              const y2 = (idx + 1) * (CARD_HEIGHT + CARD_MARGIN);
              return (
                <Line
                  key={item.id + '-arrow'}
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
            <Marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="5"
              refY="5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <Path d="M 0 0 L 10 5 L 0 10 z" fill="#a21caf" />
            </Marker>
          </Svg>
          <DraggableFlatList
            data={data}
            onDragEnd={({ data }) => setData(data)}
            keyExtractor={item => item.id}
            renderItem={({ item, drag, isActive, index }) => (
              <TouchableOpacity
                style={{
                  backgroundColor: isActive ? '#e9d5ff' : '#f3f4f6',
                  padding: 16,
                  marginBottom: CARD_MARGIN,
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: CARD_HEIGHT,
                }}
                onLongPress={drag}
                onPress={() => handleToggleAnswer(item.id)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="drag" size={24} style={{ color: '#a21caf', marginRight: 12 }} />
                <View>
                  <Text className="font-bold text-gray-800">{item.front}</Text>
                  {showAnswer[item.id] && (
                    <Text className="text-gray-600 mt-2">{item.back}</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        <Text className="text-xs text-gray-400 mt-4">(Tap a card to show/hide the answer. Drag and drop to rearrange. Arrows are for demo only.)</Text>
      </View>
    </MainLayout>
  );
}
