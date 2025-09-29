import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetInterview } from "./features/interview/interviewSlice";
import HomePage from "./pages/HomePage";
import InterviewPage from "./pages/InterviewPage";
import DashboardPage from "./pages/DashboardPage";
import CandidateDetailPage from "./pages/CandidateDetailPage";
import Layout from "./components/Layout";
import WelcomeBackModal from "./components/WelcomeBackModal";
function App() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const interviewStatus = useSelector(
    (state) => state.interview.currentInterview.status
  );
  useEffect(() => {
    const isUnfinished =
      interviewStatus === "collecting-info" ||
      interviewStatus === "in-progress";
    if (isUnfinished) {
      navigate("/interview");
      setShowModal(true);
    }
  }, []);

  const handleResume = () => {
    setShowModal(false);
  };
  const handleStartOver = () => {
    dispatch(resetInterview());
    setShowModal(false);
    navigate("/");
  };
  return (
    <>
      <WelcomeBackModal
        open={showModal}
        onResume={handleResume}
        onStartOver={handleStartOver}
      />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/candidate/:id" element={<CandidateDetailPage />} />
        </Route>
      </Routes>
    </>
  );
}
export default App;
