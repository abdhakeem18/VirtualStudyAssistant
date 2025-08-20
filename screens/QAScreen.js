import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  ScrollView,
  Alert,
} from "react-native";
import MainLayout from "./components/layout/MainLayout";
import QuizHeader from "./components/QA/QuizHeader";
import QuizQuestion from "./components/QA/QuizQuestion";
import QuizFeedback from "./components/QA/QuizFeedback";
import QuizExplanation from "./components/QA/QuizExplanation";
import QuizControls from "./components/QA/QuizControls";
import QuizResult from "./components/QA/QuizResult";
import ReviewAnswers from "./components/QA/ReviewAnswers";
import BestScoreGraph from "./components/QA/BestScoreGraph";
import AttemptHistory from "./components/QA/AttemptHistory";

const originalQA = [
  {
    id: 1,
    question: "What is a variable?",
    options: [
      { text: "A number", explanation: "A number is a value, not a variable." },
      {
        text: "A symbol for a number we don’t know yet.",
        explanation:
          "Correct! A variable is a symbol for a number we don’t know yet.",
      },
      {
        text: "A constant",
        explanation: "A constant is a value that does not change.",
      },
      {
        text: "A function",
        explanation: "A function is a rule that relates inputs to outputs.",
      },
    ],
    answer: 1,
    explanation:
      "A variable is a symbol for a number we don’t know yet. It can represent different values.",
  },
  {
    id: 2,
    question: "What is Newton’s First Law?",
    options: [
      {
        text: "Force = mass x acceleration.",
        explanation: "This is Newton’s Second Law.",
      },
      {
        text: "An object in motion stays in motion unless acted upon by a force.",
        explanation: "Correct! This is Newton’s First Law.",
      },
      {
        text: "Energy cannot be created or destroyed.",
        explanation: "This is the law of conservation of energy.",
      },
      {
        text: "The rate of change of momentum is proportional to the applied force.",
        explanation: "This is another way to state Newton’s Second Law.",
      },
    ],
    answer: 1,
    explanation:
      "Newton’s First Law states that an object in motion stays in motion (and at rest stays at rest) unless acted upon by a force.",
  },
  {
    id: 3,
    question: "What is force?",
    options: [
      {
        text: "Force = mass x acceleration.",
        explanation: "Correct! This is the definition of force.",
      },
      {
        text: "A symbol for a number we don’t know yet.",
        explanation: "This is a variable.",
      },
      {
        text: "A constant",
        explanation: "A constant is a value that does not change.",
      },
      {
        text: "A function",
        explanation: "A function is a rule that relates inputs to outputs.",
      },
    ],
    answer: 0,
    explanation: "Force is defined as mass times acceleration (F = m × a).",
  },
];

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function QAScreen({ navigation }) {
  const [qaList, setQaList] = useState([]); 
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [feedbackAnim] = useState(new Animated.Value(0));
  const [lastCorrect, setLastCorrect] = useState(null); 
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewAnswers, setReviewAnswers] = useState([]);
  const [timer, setTimer] = useState(30); 
  const timerRef = useRef();
  const [fiftyUsed, setFiftyUsed] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [history, setHistory] = useState([]); 
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("qaHistory").then((data) => {
      if (data) setHistory(JSON.parse(data));
    });
  }, []);

  const handleStartQuiz = () => {
    const shuffled = shuffleArray(originalQA).map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));
    setQaList(shuffled);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
    setShowExplanation(false);
    setStreak(0);
    setMaxStreak(0);
    setLastCorrect(null);
    setReviewMode(false);
    setReviewAnswers([]);
    setTimer(30);
    setFiftyUsed(false);
    setHiddenOptions([]);
    setQuizStarted(true);
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setTimer((t) => (t > 0 ? t - 1 : 0)),
      1000
    );
  };

  // Timer: auto next if time runs out
  useEffect(() => {
    if (timer === 0 && !showResult && !reviewMode) {
      handleSelect(null, true); 
      setTimeout(() => handleNext(), 1000);
    }
  }, [timer]);

  // Animated feedback
  const triggerFeedback = (isCorrect) => {
    setLastCorrect(isCorrect);
    feedbackAnim.setValue(0);
    Animated.timing(feedbackAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  };

  // 50/50 logic
  const handleFiftyFifty = () => {
    if (fiftyUsed) return;
    const correctIdx = qaList[current].options.findIndex(
      (o, i) => i === qaList[current].answer
    );
    let wrongs = qaList[current].options
      .map((o, i) => i)
      .filter((i) => i !== correctIdx);
    wrongs = shuffleArray(wrongs).slice(0, 2);
    setHiddenOptions(wrongs);
    setFiftyUsed(true);
  };

  // Select answer
  const handleSelect = (idx, auto = false) => {
    if (selected !== null) return;
    setSelected(idx);
    const correctIdx = qaList[current].options.findIndex(
      (o, i) => o.text === qaList[current].options[qaList[current].answer].text
    );
    const isCorrect = idx === correctIdx;
    triggerFeedback(isCorrect);
    setShowExplanation(true);
    if (isCorrect) {
      setScore((s) => s + 1);
      setStreak((prev) => {
        const newStreak = prev + 1;
        setMaxStreak((m) => (newStreak > m ? newStreak : m));
        return newStreak;
      });
    } else {
      setStreak(0);
    }
    // Save for review
    setReviewAnswers((arr) => [
      ...arr,
      {
        question: qaList[current].question,
        options: qaList[current].options,
        answer: correctIdx,
        selected: idx,
        correct: isCorrect,
        explanations: qaList[current].options.map((o) => o.explanation),
      },
    ]);
    timerRef.current && clearInterval(timerRef.current);
  };

  // Next question
  const handleNext = () => {
    if (current < qaList.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
      setShowExplanation(false);
      setLastCorrect(null);
      setTimer(30);
      setFiftyUsed(false);
      setHiddenOptions([]);
      timerRef.current && clearInterval(timerRef.current);
      timerRef.current = setInterval(
        () => setTimer((t) => (t > 0 ? t - 1 : 0)),
        1000
      );
    } else {
      setShowResult(true);
      timerRef.current && clearInterval(timerRef.current);
      const newHistory = [
        ...history,
        {
          score: Math.round(
            ((score +
              (selected !== null &&
              qaList[current].options.findIndex(
                (o, i) =>
                  o.text ===
                  qaList[current].options[qaList[current].answer].text
              ) === selected
                ? 1
                : 0)) /
              qaList.length) *
              100
          ),
          date: new Date().toISOString(),
          streak: maxStreak,
          reviewAnswers: reviewAnswers.concat([
            {
              question: qaList[current].question,
              options: qaList[current].options,
              answer: qaList[current].answer,
              selected,
              correct:
                selected !== null &&
                qaList[current].options.findIndex(
                  (o, i) =>
                    o.text ===
                    qaList[current].options[qaList[current].answer].text
                ) === selected,
              explanations: qaList[current].options.map((o) => o.explanation),
            },
          ]),
        },
      ];
      setHistory(newHistory);
      AsyncStorage.setItem("qaHistory", JSON.stringify(newHistory));
    }
  };

  // Restart
  const handleRestart = () => {
    setQuizStarted(false);
    setShowResult(false);
    setReviewMode(false);
  };

  // Animated feedback style
  const feedbackStyle = {
    opacity: feedbackAnim,
    transform: [
      {
        scale: feedbackAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.7, 1.2],
        }),
      },
    ],
  };


  // Main render
  if (reviewMode)
    return (
      <MainLayout>
        <View className="flex-1 px-4 py-14 items-center">
          <ReviewAnswers
            reviewAnswers={reviewAnswers}
            onBack={() => setReviewMode(false)}
          />
        </View>
      </MainLayout>
    );

  // Start screen
  if (!quizStarted) {
    return (
      <MainLayout>
        <ScrollView className="flex-1 px-4">
          <View className="flex-row justify-between w-full mb-2 items-center">
            <Text className="font-bold text-lg text-slate-700 mb-4">Q&A Exam</Text>
            <TouchableOpacity
              className="bg-purple-900 px-6 py-3 rounded-md mt-6 w-2/6"
              onPress={() => {
                Alert.alert(
                  "Start Quiz",
                  "Are you sure you want to start a new quiz attempt?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Start",
                      style: "default",
                      onPress: handleStartQuiz,
                    },
                  ]
                );
              }}
            >
              <Text className="text-white text-lg">Start Quiz</Text>
            </TouchableOpacity>
          </View>
          <BestScoreGraph history={history} />
          <AttemptHistory
            history={history}
            onReview={(reviewAnswers) => {
              setReviewMode(true);
              setReviewAnswers(reviewAnswers);
            }}
          />
        </ScrollView>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <View className="flex-1">
        <QuizHeader
          streak={streak}
          maxStreak={maxStreak}
          current={current}
          total={qaList.length}
          onReattempt={() => {
            Alert.alert(
              "Reattempt Quiz",
              "Are you sure you want to restart this quiz attempt?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Restart", style: "destructive", onPress: handleRestart },
              ]
            );
          }}
        />
        <ScrollView className="flex px-4 pb-26">
          {showResult ? (
            <View className="w-full">
              <QuizResult
                score={score}
                total={qaList.length}
                maxStreak={maxStreak}
                onRestart={handleRestart}
                onReview={() => setReviewMode(true)}
              />
              <BestScoreGraph history={history} />
              <AttemptHistory
                history={history}
                onReview={(reviewAnswers) => {
                  setReviewMode(true);
                  setReviewAnswers(reviewAnswers);
                }}
              />
            </View>
          ) : qaList.length > 0 ? (
            <View className="w-full">
              <QuizControls
                onNext={handleNext}
                isLast={current === qaList.length - 1}
                selected={selected}
                onFiftyFifty={handleFiftyFifty}
                fiftyUsed={fiftyUsed}
                timer={timer}
              />
              <QuizQuestion
                question={`Q${current + 1}: ${qaList[current].question}`}
                options={qaList[current].options}
                selected={selected}
                hiddenOptions={hiddenOptions}
                onSelect={handleSelect}
              />
              <QuizFeedback feedbackStyle={feedbackStyle} lastCorrect={lastCorrect} />
              {showExplanation && (
                <QuizExplanation
                  options={qaList[current].options}
                  answerIdx={qaList[current].answer}
                  selectedIdx={selected}
                />
              )}
            </View>
          ) : null}
        </ScrollView>
      </View>
    </MainLayout>
  );
}
