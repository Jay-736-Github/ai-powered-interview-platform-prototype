import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addMessage,
  updateCandidateField,
  setInterviewStatus,
  setQuestions,
  submitAnswer,
  nextQuestion,
  setFinalResults,
  archiveCurrentInterview,
} from "../features/interview/interviewSlice";
import {
  generateInterviewQuestions,
  generateInterviewSummary,
} from "../services/aiService";
import {
  Container,
  Box,
  Paper,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import MessageList from "../components/MessageList";
import MCQOptions from "../components/MCQOptions";
import QuestionTimer from "../components/QuestionTimer";
import MessageInput from "../components/MessageInput";

export default function InterviewPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    status,
    candidate,
    messages,
    questions,
    currentQuestionIndex,
    answers,
    finalScore,
    summary,
  } = useSelector((state) => state.interview.currentInterview);

  const messageQueue = useRef([]);
  const fieldsPrompted = useRef(new Set());
  const currentQuestion = questions[currentQuestionIndex];

  const enqueueMessage = (text, questionId = null) => {
    messageQueue.current.push({ sender: "ai", text, questionId });
  };
  useEffect(() => {
    const processQueue = async () => {
      if (messageQueue.current.length === 0) {
        switch (status) {
          case "collecting-info":
            if (!candidate.name && !fieldsPrompted.current.has("name")) {
              enqueueMessage("What is your full name?");
              fieldsPrompted.current.add("name");
            } else if (
              !candidate.email &&
              !fieldsPrompted.current.has("email")
            ) {
              enqueueMessage("What is your email address?");
              fieldsPrompted.current.add("email");
            } else if (
              !candidate.phone &&
              !fieldsPrompted.current.has("phone")
            ) {
              enqueueMessage("Lastly, what is your phone number?");
              fieldsPrompted.current.add("phone");
            } else if (
              candidate.name &&
              candidate.email &&
              candidate.phone &&
              !fieldsPrompted.current.has("all-set")
            ) {
              enqueueMessage(
                "Great, we have all your details. Starting interview shortly."
              );
              fieldsPrompted.current.add("all-set");
              dispatch(setInterviewStatus("ready-to-start"));
            }
            break;

          case "ready-to-start":
            if (!fieldsPrompted.current.has("questions-set")) {
              enqueueMessage(
                "Let's begin the interview. I will ask you 6 multiple-choice questions."
              );
              const fetchedQuestions = await generateInterviewQuestions();


              if (
                fetchedQuestions.length > 0 &&
                fetchedQuestions[0].id === "q_mock"
              ) {
                enqueueMessage(
                  "Sorry, I'm having trouble connecting to the AI service to generate questions. Please try again in a moment."
                );
               
              } else {
                dispatch(setQuestions(fetchedQuestions));
                dispatch(setInterviewStatus("in-progress"));
                fieldsPrompted.current.add("questions-set");
              }
            }
            break;

          case "in-progress":
            if (
              currentQuestion &&
              !messages.find((m) => m.questionId === currentQuestion.id)
            ) {
              enqueueMessage(
                `Question ${currentQuestionIndex + 1}/${questions.length} (${
                  currentQuestion.difficulty
                }): ${currentQuestion.text}`,
                currentQuestion.id
              );
            }
            break;

          case "completed":
            if (finalScore === null) {
              const results = await generateInterviewSummary(
                questions,
                answers
              );
              dispatch(setFinalResults(results));
            }
            break;

          default:
            break;
        }
      }

      if (messageQueue.current.length > 0) {
        const nextMsg = messageQueue.current.shift();
        dispatch(addMessage(nextMsg));
      }
    };

    const timer = setTimeout(processQueue, 500);
    return () => clearTimeout(timer);
  }, [
    status,
    candidate,
    currentQuestionIndex,
    questions,
    answers,
    finalScore,
    messages,
    dispatch,
  ]);
  
  const handleSendMessage = (text) => {
    dispatch(addMessage({ sender: "user", text }));
    if (status === "collecting-info") {
      if (!candidate.name)
        dispatch(updateCandidateField({ field: "name", value: text }));
      else if (!candidate.email)
        dispatch(updateCandidateField({ field: "email", value: text }));
      else if (!candidate.phone)
        dispatch(updateCandidateField({ field: "phone", value: text }));
    }
  };

  const handleSelectAnswer = (index) => {
    if (!currentQuestion) return;
    dispatch(
      addMessage({ sender: "user", text: currentQuestion.options[index] })
    );
    dispatch(
      submitAnswer({
        questionId: currentQuestion.id,
        selectedOptionIndex: index,
      })
    );
    setTimeout(() => dispatch(nextQuestion()), 500);
  };

  const handleTimeUp = () => {
    if (!currentQuestion) return;
    dispatch(addMessage({ sender: "user", text: "(Time's up!)" }));
    dispatch(
      submitAnswer({
        questionId: currentQuestion.id,
        selectedOptionIndex: null,
      })
    );
    setTimeout(() => dispatch(nextQuestion()), 500);
  };

  const handleFinishAndReset = () => {
    dispatch(archiveCurrentInterview());
    navigate("/");
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        height: "calc(100vh - 112px)",
        display: "flex",
        flexDirection: "column",
        py: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <MessageList messages={messages} />

        {status === "collecting-info" && (
          <MessageInput onSendMessage={handleSendMessage} disabled={false} />
        )}

        {status === "in-progress" && currentQuestion && (
          <>
            <QuestionTimer
              key={currentQuestion.id}
              duration={currentQuestion.timer}
              onTimeUp={handleTimeUp}
            />
            <MCQOptions
              key={`options-${currentQuestion.id}`}
              options={currentQuestion.options}
              onSelectAnswer={handleSelectAnswer}
              disabled={answers.length > currentQuestionIndex}
            />
          </>
        )}

        {status === "completed" && (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Interview Completed!</Typography>
            {finalScore !== null && (
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="h4"
                  color="primary.main"
                  sx={{ fontWeight: "bold" }}
                >
                  Final Score: {finalScore} / {questions.length * 10}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mt: 2, fontStyle: "italic", color: "text.secondary" }}
                >
                  "{summary}"
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleFinishAndReset}
                  sx={{ mt: 3 }}
                >
                  Finish & Start New Interview
                </Button>
              </Box>
            )}
            {finalScore === null && (
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <CircularProgress size={24} />
                <Typography color="text.secondary">
                  Analyzing your results...
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
}
