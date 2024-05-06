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

import { partnerServices } from '../../../services/partners/partners';
import { awsServices } from '../../../services/aws/aws'; // Importar awsServices
import { Partners, UpdatePartners, CreatePartners } from '../../types/partners';

const PartnerList = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const [action, setAction] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [partners, setPartners] = useState<Partners[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Partners>();
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
    const fetchPartners = async () => {
      try {
        const response = await partnerServices.getAllPartners('');
        setPartners(response);
      } catch (error) {
        console.error('Error fetching partners:', error);
      }
    };

    fetchPartners();
  }, []);

  const openModal = (partnerId: string, partner: Partners | null = null) => {
    const selectedPartnerData = partners.find((r) => r._id === partnerId);

    console.log(selectedPartnerData?.img);
    if (selectedPartnerData) {
      setSelectedPartner(selectedPartnerData);
      setTitle(selectedPartnerData.title);
      setDescription(selectedPartnerData.description);
      setImg(selectedPartnerData.img);
    } else {
      clearInputFields();
    }
    setModalOpen(true);
  };

  const handleAddPartner = async () => {
    const newPartner: CreatePartners = {
      img,
      title,
      description,
    };

    try {
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const photoUrl: any = await awsServices.insertImgInS3(file, ''); // Subir imagen al servicio S3
        newPartner.img = decodeURIComponent(photoUrl.fileUrl);
        setUpdatePhoto(true); // Se ha cargado una nueva foto
      }

      await partnerServices.createPartner(newPartner, '');
      const updatedPartners = await partnerServices.getAllPartners('');
      setPartners(updatedPartners);
      clearInputFields();
      closeModal();
      setAction('AGREGADA');
      setSuccessOpen(true);
      setSuccessMessage('Socio agregada correctamente');
    } catch (error) {
      console.error('Error al agregar socio:', error);
    }
  };

  const handleUpdatePartner = async () => {
    let auxImg = img;
    console.log({ selectedPartner: selectedPartner });
    console.log({ img });
    const updatedPartner: UpdatePartners = {
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
        auxImg = decodeURIComponent(photoUrl.fileUrl);
      }
    }
    updatedPartner.img = auxImg;
    console.log(updatedPartner);
    await partnerServices.updateById(selectedPartner!._id, updatedPartner, '');
    const updatedPartners = partners.map((partner) =>
      partner._id === selectedPartner!._id ? { ...partner, img: auxImg, title, description } : partner
    );
    setPartners(updatedPartners);
    clearInputFields();
    closeModal();
    setAction('ACTUALIZADA');
    setSuccessOpen(true);
    setSuccessMessage('Socio actualizado correctamente');
    setUpdating(false); // Ocultar fondo oscuro y el indicador de carga después de completar la actualización
    setConfirmOpen(false);
  };

  const handleDeletePartner = async () => {
    if (selectedPartner) {
      try {
        await partnerServices.deletePartner(selectedPartner._id, '');
        const updatedPartners = partners.filter((partner) => partner._id !== selectedPartner._id);

        setPartners(updatedPartners);
        clearInputFields();
        closeModal();
        setAction('ELIMINADA');
        setSuccessOpen(true);
        setSuccessMessage('Socio eliminado correctamente');
        setConfirmOpen(false); // Aquí se cierra la modal de confirmación
      } catch (error) {
        console.error('Error al eliminar socio:', error);
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
    setImg('https://bucket-harmony.s3.amazonaws.com/default-logo.png');
    setSelectedPartner(undefined);
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

  const filteredPartners = partners.filter((partner) =>
    normalizeString(partner.title).toLowerCase().includes(normalizeString(searchTerm).toLowerCase())
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
        LISTADO DE SOCIOS
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
            {filteredPartners.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((partner) => (
              <TableRow
                key={partner._id}
                onClick={() => openModal(partner._id, partner)}
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'inherit')}
              >
                <TableCell>{partner.title}</TableCell>
                <TableCell>{partner.description}</TableCell>
                <TableCell>
                  <img src={partner.img} alt="Partner" style={{ width: '100px', height: '100px' }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredPartners.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={modalOpen} onClose={closeModal}>
        <DialogTitle>{selectedPartner ? 'Editar Socio' : 'Agregar Socio'}</DialogTitle>
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
          <Tooltip title="Busca el logotipo de tu empresa">
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
                  src={img || 'https://bucket-harmony.s3.amazonaws.com/default-logo.png'}
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
          {selectedPartner && (
            <Button onClick={() => setConfirmOpen(true)} variant="contained" color="error">
              Eliminar
            </Button>
          )}
          <Button onClick={closeModal} variant="outlined" color="primary">
            Cancelar
          </Button>
          <Button
            onClick={selectedPartner ? handleUpdatePartner : handleAddPartner}
            variant="contained"
            color="primary"
            disabled={!title || !description}
          >
            {selectedPartner ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body1">¿Está seguro de que desea eliminar este socio?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} variant="outlined" color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeletePartner} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      <Button onClick={() => openModal('', null)} variant="contained" color="primary">
        Agregar Socio
      </Button>
    </Container>
  );
};

export default PartnerList;
