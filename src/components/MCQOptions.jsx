import React from "react";
import { Box, Button } from "@mui/material";

export default function MCQOptions({
  options = [],
  onSelectAnswer,
  disabled = false,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
      }}
    >
      {options.map((option, index) => (
        <Button
          key={index}
          variant="outlined"
          onClick={() => onSelectAnswer(index)}
          disabled={disabled}
          sx={{ textAlign: "left" }}
        >
          {option}
        </Button>
      ))}
    </Box>
  );
}
