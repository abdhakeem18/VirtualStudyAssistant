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
import QuizPDFExport from "./components/QA/QuizPDFExport";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import API from "../config/api";

export default function QAScreen({ route, navigation }) {
  const [originalQA, setOriginalQA] = useState([]);
  const [qaList, setQaList] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [feedbackAnim] = useState(new Animated.Value(0));
  const [lastCorrect, setLastCorrect] = useState({
    answer: null,
    correct: false,
  });
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewAnswers, setReviewAnswers] = useState([]);
  const [timer, setTimer] = useState(30);
  const timerRef = useRef();
  const [fiftyUsed, setFiftyUsed] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [history, setHistory] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [message, setMessage] = useState("");
  const [recordID, setRecordID] = useState(null);
  const [showPDFExport, setShowPDFExport] = useState(false);
  const docId = route.params?.docId || 0;

  useEffect(() => {
    fetchQuizData();
    getAttemptHistory();
  }, []);

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const fetchQuizData = async () => {
    setMessage("");

    try {
      const apiv = API("v1");
      const response = await apiv.get(`/quiz/get/${docId}`);
      if (response.data.success) {
        setOriginalQA(response.data?.questions || []);
      } else {
        setMessage({
          error: response.data.message || "Failed to fetch summary",
        });
      }
    } catch (err) {
      setMessage({ error: err.message || "Failed to fetch summary" });
    }
  };

  const getAttemptHistory = async () => {
    try {
      const apiv = API("v1");
      const response = await apiv.get(`/attempts/get/${docId}`);
      if (response.data.success) {
        const history = response.data?.history;
        setRecordID(history?.id || null);
        setHistory(
          history?.quizHistory
            ? typeof history?.quizHistory === "object"
              ? history?.quizHistory
              : JSON.parse(history?.quizHistory)
            : []
        );
      }
    } catch (err) {
      setMessage({ error: err.message || "Failed to fetch history" });
    }
  };

  const handleStartQuiz = () => {
    const shuffled = shuffleArray(originalQA).map((q) => ({
      ...q,
      options: shuffleArray(JSON.parse(q.options)),
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
    setFiftyUsed({ status: false, attempts: 0 });
    setHiddenOptions([]);
    setQuizStarted(true);
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setTimer((t) => (t > 0 ? t - 1 : 0)),
      1000
    );
  };

  useEffect(() => {
    if (
      timer === 0 &&
      !showResult &&
      !reviewMode &&
      selected === null &&
      quizStarted
    ) {
      handleSelect(null, true);
      setTimeout(() => handleNext(), 1500);
    }
  }, [timer, showResult, reviewMode, selected, quizStarted]);

  const triggerFeedback = (isCorrect, correctIdx) => {
    setLastCorrect({ answer: correctIdx, correct: isCorrect });
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
    if (fiftyUsed.attempts >= 3) {
      setMessage({ error: "50/50 lifeline has been used up." });
      return;
    }

    // Find the correct answer index in the shuffled options array
    const correctIdx = qaList[current].options.findIndex(
      (option) => parseInt(option.position) === parseInt(qaList[current].answer)
    );

    // Get indices of wrong answers
    let wrongs = qaList[current].options
      .map((option, index) => index)
      .filter((index) => index !== correctIdx);

    // Randomly select 2 wrong answers to hide
    wrongs = shuffleArray(wrongs).slice(0, 2);
    setHiddenOptions(wrongs);
    setFiftyUsed({ status: true, attempts: (fiftyUsed?.attempts || 0) + 1 });
  };

  // Select answer
  const handleSelect = (idx, auto = false) => {
    if (selected !== null) return;
    setSelected(idx);

    // Find the correct answer index in the shuffled options array
    const correctIdx = qaList[current].options.findIndex(
      (option) => parseInt(option.position) === parseInt(qaList[current].answer)
    );

    const isCorrect = idx === correctIdx;
    triggerFeedback(isCorrect, correctIdx);
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
        answer: correctIdx, // Store the correct option index
        selected: idx, // Store the selected option index
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
      setFiftyUsed({
        status: fiftyUsed.attempts >= 3 ? true : false,
        attempts: fiftyUsed?.attempts || 0,
      });
      setHiddenOptions([]);
      timerRef.current && clearInterval(timerRef.current);
      timerRef.current = setInterval(
        () => setTimer((t) => (t > 0 ? t - 1 : 0)),
        1000
      );
    } else {
      // Quiz completed - calculate final score
      setShowResult(true);
      timerRef.current && clearInterval(timerRef.current);

      // Calculate final score as percentage
      const finalScore = Math.round((score / qaList.length) * 100);

      const newHistory = [
        ...history,
        {
          score: finalScore,
          date: new Date().toISOString(),
          streak: maxStreak,
          reviewAnswers: [...reviewAnswers], // Use existing reviewAnswers array
        },
      ];
      setHistory(newHistory);
      saveAttemptHistory(newHistory);
    }
  };

  const saveAttemptHistory = async (newHistory) => {
    try {
      const apiv = API("v1");
      let response;

      if (!recordID) {
        response = await apiv.post("/attempts/save", {
          document_id: docId,
          quiz_history: JSON.stringify(newHistory),
          type: "quiz",
        });
      } else {
        response = await apiv.put("/attempts/update/" + recordID, {
          document_id: docId,
          quiz_history: JSON.stringify(newHistory),
          type: "quiz",
        });
      }

      if (response.status === 200) {
        await getAttemptHistory();
        setMessage({ success: "History saved successfully" });
      } else {
        setMessage({ error: "Failed to save history" });
      }
    } catch (err) {
      setMessage({ error: err.message || "Failed to save history" });
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

  return (
    <MainLayout message={message} setMessage={setMessage}>
      {reviewMode ? (
        <View className="flex-1 px-4 py-14 items-center">
          <ReviewAnswers
            reviewAnswers={reviewAnswers}
            onBack={() => setReviewMode(false)}
          />
        </View>
      ) : (
        <>
          {!quizStarted ? (
            <ScrollView className="flex-1 px-4">
              <View className="flex-row justify-between w-full mb-2 items-center">
                <Text className="font-bold text-lg text-slate-700 mb-4">
                  Q&A Exam
                </Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    className="bg-blue-950 px-4 py-3 rounded-md mt-6 flex-row items-center"
                    onPress={() => setShowPDFExport(true)}
                  >
                    <MaterialCommunityIcons
                      name="file-pdf-box"
                      size={20}
                      color="white"
                    />
                    <Text className="text-white text-sm ml-2">Export PDF</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-purple-950 px-6 py-3 rounded-md mt-6"
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
          ) : (
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
                      {
                        text: "Restart",
                        style: "destructive",
                        onPress: handleRestart,
                      },
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
                      lastCorrect={lastCorrect?.answer}
                      onSelect={handleSelect}
                    />
                    <QuizFeedback
                      feedbackStyle={feedbackStyle}
                      lastCorrect={lastCorrect?.correct}
                    />
                    {showExplanation && (
                      <QuizExplanation
                        options={qaList[current].options}
                        answerIdx={lastCorrect?.answer}
                        selectedIdx={selected}
                      />
                    )}
                  </View>
                ) : null}
              </ScrollView>
            </View>
          )}
        </>
      )}

      {/* PDF Export Modal */}
      <QuizPDFExport
        docId={docId}
        visible={showPDFExport}
        onClose={() => setShowPDFExport(false)}
        setMessage={setMessage}
      />
    </MainLayout>
  );
}
