import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Container,
  Tooltip,
  Alert,
  AlertTitle,
  Stack,
  TablePagination,
  Box,
  Backdrop,
  CircularProgress,
} from '@mui/material';

import { questionServices } from '../../../services/questions/questions';
import { Questions, UpdateQuestions } from '../../types/questions';


const QuestionList = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const [action, setAction] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Questions | null>(null);
  
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [updatePhoto, setUpdatePhoto] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const closeSuccessMessage = () => {
    setTimeout(() => {
      setSuccessMessage('');
    }, 10000); // 10000 milisegundos = 10 segundos
  };

  useEffect(() => {
    if (successMessage) {
      closeSuccessMessage();
    }
    const fetchQuestions = async () => {
      try {
        const response = await questionServices.getAllQuestions('');
        setQuestions(response);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const openModal = (questionId: string, question: Questions | null = null) => {
    const selectedQuestionData = questions.find((r) => r._id === questionId);

    if (selectedQuestionData) {
      setSelectedQuestion(selectedQuestionData);
      setQuestion(selectedQuestionData.question);
      setAnswer(selectedQuestionData.answer);
      
    } else {
      clearInputFields();
    }
    setModalOpen(true);
  };

  const handleUpdateQuestion = async () => {
    if (selectedQuestion) {
      setUpdating(true);
  
      const updatedQuestion: UpdateQuestions = {
        _id: selectedQuestion._id,
        question: question,
        answer: answer,
      };
  
      try {
        await questionServices.updateById(selectedQuestion._id, updatedQuestion, '');
  
        // Actualizar el estado de questions después de la actualización
        const updatedQuestions = questions.map((q) =>
          q._id === selectedQuestion._id ? { ...q, question: question, answer: answer } : q
        );
  
        setQuestions(updatedQuestions); // Actualiza el estado con las preguntas actualizadas
  
        clearInputFields();
        closeModal();
        setAction('Contestada');
        setSuccessOpen(true);
        setSuccessMessage('La pregunta ha sido respondida correctamente');
        setUpdating(false);
        setConfirmOpen(false);
      } catch (error) {
        console.error('Error al actualizar pregunta:', error);
      }
    }
  };
  
//   const handleUpdateQuestion = async () => {
//     if (selectedQuestion) {
//       setUpdating(true); // Mostrar fondo oscuro y el indicador de carga

//       const updatedQuestion: UpdateQuestions = {
//         _id: selectedQuestion._id,
//         question: question,
//         answer: answer,
//       };

//       try {
//         await questionServices.updateById(selectedQuestion._id, updatedQuestion, ''); // Actualizar la pregunta en el backend
//         const updatedQuestions = questions.map((question) =>
//           question._id === selectedQuestion._id ? { ...question, title: question, description: answer } : question
//         );

//         setQuestions(updatedQuestions);
//         clearInputFields();
//         closeModal();
//         setAction('Contestada');
//         setSuccessOpen(true);
//         setSuccessMessage('Se respondio correctamente la pregunta');
//         setUpdating(false); // Ocultar fondo oscuro y el indicador de carga después de completar la actualización
//         setConfirmOpen(false); // Aquí se cierra la modal de confirmación después de eliminar la pregunta
//       } catch (error) {
//         console.error('Error al actualizar pregunta:', error);
//       }
//     }
//   };

  const handleDeleteQuestion = async () => {
    if (selectedQuestion) {
      try {
        await questionServices.deleteQuestion(selectedQuestion._id, '');
        const updatedQuestions = questions.filter((question) => question._id !== selectedQuestion._id);

        setQuestions(updatedQuestions);
        clearInputFields();
        closeModal();
        setAction('ELIMINADA');
        setSuccessOpen(true);
        setSuccessMessage('La pregunta ha sido eliminada correctamente');
        setConfirmOpen(false); // Aquí se cierra la modal de confirmación después de eliminar la pregunta
      } catch (error) {
        console.error('Error al eliminar pregunta:', error);
      }
    }
  };

  const closeModal = () => {
    clearInputFields();
    setModalOpen(false);
    setSuccessOpen(false);
  };

  const clearInputFields = () => {
    setQuestion('');
    setAnswer('');
    setSelectedQuestion(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const normalizeString = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const filteredQuestions = questions.filter((question) =>
    normalizeString(question.question).toLowerCase().includes(normalizeString(searchTerm).toLowerCase())
  );

  return (
    <Container component="main" maxWidth="md">
      <Backdrop open={updating}>
        <CircularProgress color="inherit" />
      </Backdrop>{' '}
      {/* Mostrar el fondo oscuro mientras loading sea true */}
      <br />
      <br />
      {successMessage && (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert
            severity="success"
            onClose={() => {
              setSuccessMessage('');
            }}
          >
            <AlertTitle>{action}</AlertTitle>
            {successMessage}
          </Alert>
        </Stack>
      )}
      <Typography variant="h3" align="justify">
        LISTADO DE PREGUNTAS
      </Typography>
      <Tooltip title="Buscar titulo de la pregunta">
        <TextField
          label="Buscar"
          variant="outlined"
          margin="normal"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
        />
      </Tooltip>
      <br />
      <br />
      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell style={{ fontWeight: 700 }}>PREGUNTA</TableCell>
              <TableCell style={{ fontWeight: 700 }}>RESPUESTA</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredQuestions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((question) => (
              <TableRow
                key={question._id}
                onClick={() => openModal(question._id, question)}
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'inherit')}
              >
                <TableCell>{question.question}</TableCell>
                <TableCell>{question.answer}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredQuestions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={modalOpen} onClose={closeModal}>
        <DialogTitle>{'Responder pregunta'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Nombre completo"
            variant="outlined"
            fullWidth
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <TextField
            margin="normal"
            label="Comentarios"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          {selectedQuestion && (
            <Button onClick={() => setConfirmOpen(true)} variant="contained" color="error">
              Eliminar
            </Button>
          )}
          <Button onClick={closeModal} variant="outlined" color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleUpdateQuestion}
            variant="contained"
            color="primary"
            disabled={!question || !answer}
          >
            {'Responder'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body1">¿Está seguro de que desea eliminar esta pregunta?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} variant="outlined" color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteQuestion} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QuestionList;
