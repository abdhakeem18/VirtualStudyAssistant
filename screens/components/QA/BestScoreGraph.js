import React from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function BestScoreGraph({ history }) {
  if (!history || history.length === 0) return null;
  const scores = history.map((h) => h.score);
  const labels = history.map((h, i) => `${i + 1}`);
  const best = Math.max(...scores);
  return (
    <View className="w-full mb-4">
      <Text className="font-bold text-base mb-2">Best Score: {best}%</Text>
      <LineChart
        data={{ labels, datasets: [{ data: scores }] }}
        width={Dimensions.get("window").width - 48}
        height={180}
        yAxisSuffix="%"
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(168, 139, 250, ${opacity})`,
          labelColor: () => "#64748b",
          style: { borderRadius: 8 },
          propsForDots: { r: "4", strokeWidth: "2", stroke: "#a78bfa" },
        }}
        bezier
        style={{ borderRadius: 8 }}
      />
    </View>
  );
}
