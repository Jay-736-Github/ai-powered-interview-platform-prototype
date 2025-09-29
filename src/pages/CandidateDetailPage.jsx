import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MessageList from "../components/MessageList";

export default function CandidateDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const interview = useSelector((state) =>
    state.interview.completedInterviews.find((interview) => interview.id === id)
  );

  if (!interview) {
    return (
      <Container maxWidth="md" sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Interview not found.
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard")}
          sx={{ mt: 3 }}
          variant="contained"
          color="primary"
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>

      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard")}
          variant="outlined"
          color="primary"
        >
          Back to Dashboard
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, mb: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
          {interview.candidate.name}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 4,
            mb: 2,
          }}
        >
          <Typography variant="body1">
            <strong>Email:</strong> {interview.candidate.email}
          </Typography>
          <Typography variant="body1">
            <strong>Phone:</strong> {interview.candidate.phone}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="h5"
          color="primary.main"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          Final Score: {interview.finalScore} /{" "}
          {interview.questions.length * 10}
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontStyle: "italic", color: "text.secondary" }}
        >
          "{interview.summary}"
        </Typography>
      </Paper>

      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Chat History
      </Typography>
      <Paper
        elevation={3}
        sx={{
          height: "500px",
          display: "flex",
          flexDirection: "column",
          p: 2,
          borderRadius: 3,
        }}
      >
        <MessageList messages={interview.messages} />
      </Paper>
    </Container>
  );
}