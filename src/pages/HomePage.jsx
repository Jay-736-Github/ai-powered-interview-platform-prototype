import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { initializeInterview } from "../features/interview/interviewSlice";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FloatingIcons from "../components/FloatingIcons";
import { extractResumeInfo } from "../services/aiService";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.mjs`;
import mammoth from "mammoth";

export default function HomePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (
      file.type !== "application/pdf" &&
      file.type !==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      setError("Invalid file type. Please upload a PDF or DOCX file.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          let fullText = "";

          if (file.type === "application/pdf") {
            const pdfData = new Uint8Array(e.target.result);
            const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
            const numPages = pdf.numPages;

            for (let i = 1; i <= numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              fullText +=
                textContent.items.map((item) => item.str).join(" ") + "\n";
            }
          } else {
            const arrayBuffer = e.target.result;
            const result = await mammoth.extractRawText({ arrayBuffer });
            fullText = result.value;
          }

          const info = await extractResumeInfo(fullText);

          if (info.error) {
            setError(info.error);
            setIsProcessing(false);
            return;
          }

          dispatch(initializeInterview(info));
          navigate("/interview");
        } catch (err) {
          console.error("Error processing file or calling AI:", err);
          setError("Failed to process the resume. Please try another file.");
          setIsProcessing(false);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error("Error reading file:", err);
      setError("Could not read the selected file.");
      setIsProcessing(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        position: "relative",
      }}
    >
      <FloatingIcons />
      <Paper
        elevation={6}
        sx={{
          p: { xs: 4, md: 6 },
          borderRadius: 4,
          textAlign: "center",
          maxWidth: "700px",
          width: "90%",
        }}
      >
        <Stack spacing={4} alignItems="center">
          <Typography
            variant="h4"
            component="h4"
            sx={{
              fontWeight: "bold",
              fontFamily: "Georgia, serif",
              letterSpacing: "1px",
              color: "black",
            }}
          >
            Your AI-Powered Interview Assistant
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontFamily: "Georgia, serif", lineHeight: 1.6 }}
          >
            Upload your resume to begin a simulated interview for a Full Stack
            role.
          </Typography>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept=".pdf,.docx"
          />

          <Button
            variant="contained"
            size="large"
            startIcon={
              isProcessing ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <UploadFileIcon />
              )
            }
            onClick={handleButtonClick}
            disabled={isProcessing}
            sx={{
              mt: 2,
              py: 1.5,
              px: 6,
              fontSize: "1.1rem",
              borderRadius: 3,
              boxShadow: 3,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: 6,
                backgroundColor: "primary.dark",
              },
            }}
          >
            {isProcessing ? "Analyzing Resume..." : "Upload Resume (PDF/DOCX)"}
          </Button>

          {error && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              {error}
            </Alert>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}