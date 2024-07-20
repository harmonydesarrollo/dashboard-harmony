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
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';

import { treatmentsServices } from '../../../services/treatments/treatments';
import { CreateTreatments, Treatments, UpdateTreatments } from '../../types/treatments';
import { awsServices } from '../../../services/aws/aws'; // Importar awsServices
import { Branches } from '../../types/branches';
import { branchServices } from '../../../services/branches/branches';
// import { branchesServices } from '../../../services/branches/branches';
// import { reviewServices } from '../../../services/reviews/reviews';

const TreatmentList = () => {
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [initialBranches, setInitialBranches] = useState<Branches[]>([]);
  const [branch, setBranch] = useState<string>('');
  
  
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const [action, setAction] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [reviews, setReviews] = useState<Treatments[]>([]);
  const [selectedReview, setSelectedReview] = useState<Treatments | null>(null);
  const [img, setImg] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
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
    const fetchReviews = async () => {
      try {
        const response = await treatmentsServices.getAllTreatments('');
        setReviews(response);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    // branches
    const fetchBranches = async () => {
      try {
        const response = await branchServices.getAllBranches('');
        setInitialBranches(response);
      } catch (error) {
        console.error('Error fetching specialties:', error);
      }
    };
    
    fetchReviews();
    fetchBranches();
  }, []);

  const openModal = (reviewId: string, review: Treatments | null = null) => {
    const selectedReviewData = reviews.find((r) => r._id === reviewId);

    if (selectedReviewData) {
      setSelectedReview(selectedReviewData);
      setTitle(selectedReviewData.title);
      setDescription(selectedReviewData.description);
      setImg(selectedReviewData.img);
      setSelectedBranch(selectedReviewData.idBranch)
    } else {
      clearInputFields();
    }
    setModalOpen(true);
  };

  const handleAddReview = async () => {
    const newReview: CreateTreatments = {
      img,
      title,
      description,
      idBranch: selectedBranch
    };

    try {
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const photoUrl: any = await awsServices.insertImgInS3(file, ''); // Subir imagen al servicio S3
        newReview.img = decodeURIComponent(photoUrl.fileUrl); // Actualizar URL de imagen en la reseña
        setUpdatePhoto(true); // Se ha cargado una nueva foto
      }

      await treatmentsServices.createTreatments(newReview, ''); // Crear la reseña en el backend
      const updatedReviews = await treatmentsServices.getAllTreatments('');
      setReviews(updatedReviews);
      clearInputFields();
      closeModal();
      setAction('AGREGADA');
      setSuccessOpen(true);
      setSuccessMessage('Tratamiento agregado correctamente');
      // setConfirmOpen(true); // Aquí se cierra la modal de confirmación después de eliminar la reseña
    } catch (error) {
      console.error('Error al agregar un tratamiento:', error);
    }
  };

  const handleUpdateReview = async () => {
    if (selectedReview) {
      setUpdating(true); // Mostrar fondo oscuro y el indicador de carga

      const updatedReview: UpdateTreatments = {
        _id: selectedReview._id,
        img,
        title,
        description,
        idBranch: selectedBranch
      };

      try {
        if (updatePhoto) {
          const fileInput = document.getElementById('fileInput') as HTMLInputElement;
          if (fileInput && fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            const photoUrl: any = await awsServices.insertImgInS3(file, '');
            updatedReview.img = decodeURIComponent(photoUrl.fileUrl); // Actualizar URL de imagen en la reseña
          }
        }

        await treatmentsServices.updateById(selectedReview._id, updatedReview, ''); // Actualizar la reseña en el backend
        const updatedReviews = reviews.map((review) =>
          review._id === selectedReview._id ? { ...review, img, title, description } : review
        );

        setReviews(updatedReviews);
        clearInputFields();
        closeModal();
        setAction('ACTUALIZADA');
        setSuccessOpen(true);
        setSuccessMessage('Tratamiento actualizado correctamente');
        setUpdating(false); // Ocultar fondo oscuro y el indicador de carga después de completar la actualización
        setConfirmOpen(false); // Aquí se cierra la modal de confirmación después de eliminar la reseña
      } catch (error) {
        console.error('Error al actualizar tratamiento:', error);
      }
    }
  };

  const handleDeleteReview = async () => {
    if (selectedReview) {
      try {
        await treatmentsServices.deleteTreatments(selectedReview._id, '');
        const updatedReviews = reviews.filter((review) => review._id !== selectedReview._id);

        setReviews(updatedReviews);
        clearInputFields();
        closeModal();
        setAction('ELIMINADA');
        setSuccessOpen(true);
        setSuccessMessage('Tratamiento eliminado correctamente');
        setConfirmOpen(false); // Aquí se cierra la modal de confirmación después de eliminar la reseña
      } catch (error) {
        console.error('Error al eliminar tratamiento:', error);
      }
    }
  };

  const closeModal = () => {
    clearInputFields();
    setModalOpen(false);
    setSuccessOpen(false);
  };

  const clearInputFields = () => {
    setTitle('');
    setDescription('');
    setImg('https://bucket-harmony.s3.amazonaws.com/tratamientos.jpeg');
    setSelectedReview(null);
    setSelectedBranch('');
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

  const filteredReviews = reviews.filter((review) =>
    normalizeString(review.title).toLowerCase().includes(normalizeString(searchTerm).toLowerCase())
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
        TIPOS DE TRATAMIENTOS
      </Typography>
      <Tooltip title="Buscar por nombre">
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
              <TableCell style={{ fontWeight: 700 }}>NOMBRE</TableCell>
              <TableCell style={{ fontWeight: 700 }}>DESCRIPCIÓN</TableCell>
              <TableCell style={{ fontWeight: 700 }}>IMAGEN</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReviews.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((review) => (
              <TableRow
                key={review._id}
                onClick={() => openModal(review._id, review)}
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'inherit')}
              >
                <TableCell>{review.title}</TableCell>
                <TableCell>{review.description}</TableCell>
                <TableCell>
                  <img src={review.img} alt="Review" style={{ width: '100px', height: '100px' }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredReviews.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={modalOpen} onClose={closeModal}>
        <DialogTitle>{selectedReview ? 'Editar Tratamiento' : 'Agregar Tratamiento'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Nombre"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="normal"
            label="Descripción"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <br/>
          <br/>
          <Box>
          <FormControl fullWidth>
                  <Select
                    value={selectedBranch}
                    onChange={(e) => {
                      const selectedBranchId = e.target.value as string;
                      const selectedBranchName =
                      initialBranches.find((branch) => branch._id === selectedBranch)?._id || '';
                      setSelectedBranch(selectedBranchId);
                      setBranch(selectedBranchName); // Establecer el nombre de la especialidad en el estado specialty
                    }}
                  >
                    {initialBranches.map((specialty) => (
                      <MenuItem key={specialty._id} value={specialty._id}>
                        {specialty.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Seleccione una sucursal</FormHelperText>
                </FormControl>
              </Box>
              <br/>
          <br/>
          {/* Input para cargar imágenes */}
          <Tooltip title="Busca la imagen del tratamiento">
            <Box mb={2} textAlign="center">
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      if (reader.result) {
                        setImg(reader.result.toString());
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <label htmlFor="fileInput">
                <img
                  //
                  src={img || 'https://bucket-harmony.s3.amazonaws.com/tratamientos.jpeg'}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: '200px',
                    cursor: 'pointer',
                    objectFit: 'fill',
                    // borderRadius: '50%',
                  }}
                />
              </label>
            </Box>
          </Tooltip>
          
          {/* Fin del input para cargar imágenes */}
        </DialogContent>
        <DialogActions>
          {selectedReview && (
            <Button onClick={() => setConfirmOpen(true)} variant="contained" color="error">
              Eliminar
            </Button>
          )}
          <Button onClick={closeModal} variant="outlined" color="primary">
            Cancelar
          </Button>
          <Button
            onClick={selectedReview ? handleUpdateReview : handleAddReview}
            variant="contained"
            color="primary"
            disabled={!title || !description}
          >
            {selectedReview ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body1">¿Está seguro de que desea eliminar este tratamiento?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} variant="outlined" color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteReview} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      <Button onClick={() => openModal('', null)} variant="contained" color="primary">
        NUEVO
      </Button>
    </Container>
  );
};

export default TreatmentList;
