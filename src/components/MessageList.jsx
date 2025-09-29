import { Box, Paper, Typography, Avatar } from "@mui/material";
import { motion } from "framer-motion";
const AIAvatar = () => (
  <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>AI</Avatar>
);
export default function MessageList({ messages }) {
  return (
    <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
      {messages.map((msg, index) => {
        const isUser = msg.sender === "user";
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                mb: 2,
              }}
            >
              {!isUser && <AIAvatar />}
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  ml: isUser ? 0 : 1,
                  mr: isUser ? 1 : 0,
                  bgcolor: isUser ? "primary.main" : "background.paper",
                  color: isUser ? "primary.contrastText" : "text.primary",
                  borderRadius: isUser
                    ? "20px 20px 5px 20px"
                    : "20px 20px 20px 5px",
                  maxWidth: "70%",
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                  {msg.text}
                </Typography>
              </Paper>
            </Box>
          </motion.div>
        );
      })}
    </Box>
  );
}
