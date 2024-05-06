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

import { treatmentsServices } from '../../../services/treatments/treatments';
import { awsServices } from '../../../services/aws/aws'; // Importar awsServices
import { Treatments, UpdateTreatments, CreateTreatments } from '../../types/treatments';

const TreatmentsList = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const [action, setAction] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [treatments, setTreatments] = useState<Treatments[]>([]);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatments>();
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
    const fetchTreatments = async () => {
      try {
        const response = await treatmentsServices.getAllTreatments('');
        setTreatments(response);
      } catch (error) {
        console.error('Error fetching treatments:', error);
      }
    };

    fetchTreatments();
  }, []);

  const openModal = (TreatmentId: string, treatment: Treatments | null = null) => {
    const selectedTreatmentData = treatments.find((r) => r._id === TreatmentId);

    console.log(selectedTreatmentData?.img);
    if (selectedTreatmentData) {
      setSelectedTreatment(selectedTreatmentData);
      setTitle(selectedTreatmentData.title);
      setDescription(selectedTreatmentData.description);
      setImg(selectedTreatmentData.img);
    } else {
      clearInputFields();
    }
    setModalOpen(true);
  };

  const handleAddTreatment = async () => {
    const newTreatment: CreateTreatments = {
      img,
      title,
      description,
    };

    try {
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const photoUrl: any = await awsServices.insertImgInS3(file, ''); // Subir imagen al servicio S3
        newTreatment.img = decodeURIComponent(photoUrl.fileUrl); // Actualizar URL de imagen en la reseña
        setUpdatePhoto(true); // Se ha cargado una nueva foto
      }

      await treatmentsServices.createTreatments(newTreatment, ''); // Crear la reseña en el backend
      const updatedTreatments = await treatmentsServices.getAllTreatments('');
      setTreatments(updatedTreatments);
      clearInputFields();
      closeModal();
      setAction('¡AGREGADO EXITOSAMENTE!');
      setSuccessOpen(true);
      setSuccessMessage('Se ha dado de alta correctamente.');
      // setConfirmOpen(true); // Aquí se cierra la modal de confirmación después de eliminar la reseña
    } catch (error) {
      console.error('Error al agregar tratamiento:', error);
    }
  };

  const handleUpdateTreatment = async () => {
    let auxImg = img;
    console.log({ selectedTreatment: selectedTreatment });
    console.log({ img });
    const updatedTreatment: UpdateTreatments = {
      img,
      title,
      description,
    };
    if (img.includes('bucket-harmony')) {
      console.log('es la misma imagen');
    } else {
      console.log('ya busco nuna nueva');
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        console.log('entro aqui: ');
        console.log({ file });
        const photoUrl: any = await awsServices.insertImgInS3(file, '');
        console.log(photoUrl);
        auxImg = decodeURIComponent(photoUrl.fileUrl); // Actualizar URL de imagen en la reseña
      }
    }
    updatedTreatment.img = auxImg;
    console.log(updatedTreatment);
    await treatmentsServices.updateById(selectedTreatment!._id, updatedTreatment, ''); // Actualizar la reseña en el backend
    const updatedTreatments = treatments.map((treatment) =>
      treatment._id === selectedTreatment!._id ? { ...treatment, img: auxImg, title, description } : treatment
    );
    setTreatments(updatedTreatments);
    clearInputFields();
    closeModal();
    setAction('¡ACTUALIZACIÓN ÉXITOSA!');
    setSuccessOpen(true);
    setSuccessMessage('Tratamiento actualizado: ' + title);
    setUpdating(false); // Ocultar fondo oscuro y el indicador de carga después de completar la actualización
    setConfirmOpen(false); // Aquí se cierra la modal de confirmación después de eliminar la reseña
  };

  const handleDeleteTreatment = async () => {
    if (selectedTreatment) {
      try {
        await treatmentsServices.deleteTreatments(selectedTreatment._id, '');
        const updatedTreatments = treatments.filter((treatment) => treatment._id !== selectedTreatment._id);

        setTreatments(updatedTreatments);
        clearInputFields();
        closeModal();
        setAction('¡ELIMINACIÓN ÉXITOSA!');
        setSuccessOpen(true);
        setSuccessMessage('Tratamiento eliminado: ' + title);
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
    setImg('https://bucket-harmony.s3.amazonaws.com/sss.jpeg');
    setSelectedTreatment(undefined);
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

  const filteredTreatments = treatments.filter((treatment) =>
    normalizeString(treatment.title).toLowerCase().includes(normalizeString(searchTerm).toLowerCase())
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
        LISTADO DE TRATAMIENTOS
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
              <TableCell style={{ fontWeight: 700 }}>LOGOTIPO</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTreatments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((reatment) => (
              <TableRow
                key={reatment._id}
                onClick={() => openModal(reatment._id, reatment)}
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'inherit')}
              >
                <TableCell>{reatment.title}</TableCell>
                <TableCell>{reatment.description}</TableCell>
                <TableCell>
                  <img src={reatment.img} alt="Treatment" style={{ width: '100px', height: '100px' }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredTreatments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={modalOpen} onClose={closeModal}>
        <DialogTitle>{selectedTreatment ? 'Editar Tratamiento' : 'Agregar Tratamiento'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Nombre de la Empresa"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="normal"
            label="Resumen"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {/* Input para cargar imágenes */}
          <Tooltip title="Buscar imagen">
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
                  src={img || 'https://bucket-harmony.s3.amazonaws.com/sss.jpeg'}
                  alt="Preview"
                  style={{
                    width: '33%',
                    height: '130px',
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
          {selectedTreatment && (
            <Button onClick={() => setConfirmOpen(true)} variant="contained" color="error">
              Eliminar
            </Button>
          )}
          <Button onClick={closeModal} variant="outlined" color="primary">
            Cancelar
          </Button>
          <Button
            onClick={selectedTreatment ? handleUpdateTreatment : handleAddTreatment}
            variant="contained"
            color="primary"
            disabled={!title || !description}
          >
            {selectedTreatment ? 'Actualizar' : 'Agregar'}
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
          <Button onClick={handleDeleteTreatment} variant="contained" color="error">
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

export default TreatmentsList;
