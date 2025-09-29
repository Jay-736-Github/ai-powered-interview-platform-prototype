import { useState, useEffect } from "react";
import { Box, LinearProgress, Typography } from "@mui/material";

export default function QuestionTimer({ duration, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

  
    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp]);
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  const progress = (timeLeft / duration) * 100;

  return (
    <Box sx={{ width: "100%", p: 2, borderTop: 1, borderColor: "divider" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Time Remaining
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: "bold" }}
        >
          {timeLeft}s
        </Typography>
      </Box>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
}
