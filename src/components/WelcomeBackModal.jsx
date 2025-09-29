import { Modal, Box, Typography, Button, Stack } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  textAlign: "center",
};
export default function WelcomeBackModal({ open, onResume, onStartOver }) {
  return (
    <Modal
      open={open}
      aria-labelledby="welcome-back-title"
      aria-describedby="welcome-back-description"
    >
      <Box sx={style}>
        <Typography id="welcome-back-title" variant="h6" component="h2">
          Welcome Back!
        </Typography>
        <Typography id="welcome-back-description" sx={{ mt: 2 }}>
          It looks like you have an interview in progress.
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          sx={{ mt: 3, justifyContent: "center" }}
        >
          <Button variant="contained" onClick={onResume}>
            Resume
          </Button>
          <Button variant="outlined" color="error" onClick={onStartOver}>
            Start Over
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
