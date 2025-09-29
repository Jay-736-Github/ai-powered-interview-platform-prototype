import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  TableSortLabel,
  Box,
  Chip,
} from "@mui/material";

export default function DashboardPage() {
  const completedInterviews = useSelector(
    (state) => state.interview.completedInterviews
  );
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("finalScore");
  const [order, setOrder] = useState("desc");

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredAndSortedInterviews = useMemo(() => {
    let interviews = [...completedInterviews];

    if (searchTerm) {
      interviews = interviews.filter((interview) =>
        interview.candidate.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    interviews.sort((a, b) => {
      const isAsc = order === "asc";
      if (orderBy === "finalScore") {
        return isAsc
          ? a.finalScore - b.finalScore
          : b.finalScore - a.finalScore;
      }
      if (orderBy === "name") {
        return isAsc
          ? a.candidate.name.localeCompare(b.candidate.name)
          : b.candidate.name.localeCompare(a.candidate.name);
      }
      return 0;
    });

    return interviews;
  }, [completedInterviews, searchTerm, order, orderBy]);

  const getScoreColor = (score) => {
    if (score >= 48) return "success";
    if (score >= 30) return "warning";
    return "error";
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Interviewer Dashboard
      </Typography>

      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <TextField
          fullWidth
          label="Search by Candidate Name"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ bgcolor: "background.paper", borderRadius: 2 }}
        />
      </Paper>

      {filteredAndSortedInterviews.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <Typography color="text.secondary">
            {completedInterviews.length === 0
              ? "No interviews have been completed yet."
              : "No candidates match your search."}
          </Typography>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="completed interviews table">
            <TableHead>
              <TableRow sx={{ bgcolor: "primary.light" }}>
                <TableCell sortDirection={orderBy === "name" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={() => handleSortRequest("name")}
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1rem",
                      color: "text.primary",
                    }}
                  >
                    Candidate Name
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: "text.primary",
                  }}
                >
                  Email
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: "text.primary",
                  }}
                >
                  Phone
                </TableCell>
                <TableCell
                  align="center"
                  sortDirection={orderBy === "finalScore" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "finalScore"}
                    direction={orderBy === "finalScore" ? order : "asc"}
                    onClick={() => handleSortRequest("finalScore")}
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1rem",
                      color: "text.primary",
                    }}
                  >
                    Score
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: "text.primary",
                  }}
                >
                  AI Summary
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: "text.primary",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedInterviews.map((interview) => (
                <TableRow
                  key={interview.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { bgcolor: "action.hover" },
                    transition: "background-color 0.3s ease",
                  }}
                >
                  <TableCell component="th" scope="row">
                    {interview.candidate.name}
                  </TableCell>
                  <TableCell>{interview.candidate.email}</TableCell>
                  <TableCell>{interview.candidate.phone}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`${interview.finalScore} / 60`}
                      color={getScoreColor(interview.finalScore)}
                      sx={{ fontWeight: "bold", px: 2 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ maxWidth: "300px" }}
                    >
                      {interview.summary}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => navigate(`/candidate/${interview.id}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}