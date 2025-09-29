import { useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function MessageInput({ onSendMessage, disabled }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text.trim());
      setText("");
    }
  };

  return (
    <Box sx={{ display: "flex", p: 1 }}>
      <TextField
        fullWidth
        size="small"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        disabled={disabled}
        placeholder="Type your response..."
      />
      <IconButton onClick={handleSend} disabled={disabled}>
        <SendIcon />
      </IconButton>
    </Box>
  );
}
