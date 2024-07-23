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

import { branchServices } from '../../../services/branches/branches';
import { CreateBranches, Branches, UpdateBranches } from '../../types/branches';
import { awsServices } from '../../../services/aws/aws'; // Importar awsServices

const BranchList = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const [action, setAction] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [branches, setBranches] = useState<Branches[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branches | null>(null);
  
  const [name, setName] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [municipality, setMunicipality] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  
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
    const fetchBranches = async () => {
      try {
        const response = await branchServices.getAllBranches('');
        setBranches(response);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    fetchBranches();
  }, []);

  const openModal = (branchId: string, branch: Branches | null = null) => {
    const selectedBranchData = branches.find((r) => r._id === branchId);

    if (selectedBranchData) {
      setSelectedBranch(selectedBranchData);
      setNumber(selectedBranchData.number);
      setCity(selectedBranchData.city);
      setName(selectedBranchData.name);
      setMunicipality(selectedBranchData.municipality);
      setState(selectedBranchData.state);
      setPhone(selectedBranchData.phone);
    } else {
      clearInputFields();
    }
    setModalOpen(true);
  };

  const handleAddBranch = async () => {
    const newBranch: CreateBranches = {
      name: name,
      number: number,
      city: city,
      municipality: municipality,
      state: state,
      phone: phone
    };

    try {

      await branchServices.createBranch(newBranch, ''); // Crear la sucursal en el backend
      const updatedBranches = await branchServices.getAllBranches('');
      setBranches(updatedBranches);
      clearInputFields();
      closeModal();
      setAction('AGREGADA');
      setSuccessOpen(true);
      setSuccessMessage('Sucursal agregada correctamente');
      // setConfirmOpen(true); // Aquí se cierra la modal de confirmación después de eliminar la sucursal
    } catch (error) {
      console.error('Error al agregar sucursal:', error);
    }
  };

  const handleUpdateBranch = async () => {
    if (selectedBranch) {
      setUpdating(true); // Mostrar fondo oscuro y el indicador de carga

      const updatedBranch: UpdateBranches = {
        _id: selectedBranch._id,
        name: name,
        number: number,
        city: city,
        municipality: municipality,
        state: state,
        phone: phone
      };

      try {

        await branchServices.updateById(selectedBranch._id, updatedBranch, ''); // Actualizar la sucursal en el backend
        const updatedBranches = branches.map((branch) =>
          branch._id === selectedBranch._id ? { ...branch, name: name, number: number, city: city, municipality: municipality, state: state, phone: phone } : branch
        );

        setBranches(updatedBranches);
        clearInputFields();
        closeModal();
        setAction('ACTUALIZADA');
        setSuccessOpen(true);
        setSuccessMessage('Sucursal actualizada correctamente');
        setUpdating(false); // Ocultar fondo oscuro y el indicador de carga después de completar la actualización
        setConfirmOpen(false); // Aquí se cierra la modal de confirmación después de eliminar la sucursal
      } catch (error) {
        console.error('Error al actualizar sucursal:', error);
      }
    }
  };

  const handleDeleteBranch = async () => {
    if (selectedBranch) {
      try {
        await branchServices.deleteBranch(selectedBranch._id, '');
        const updatedBranches = branches.filter((branch) => branch._id !== selectedBranch._id);

        setBranches(updatedBranches);
        clearInputFields();
        closeModal();
        setAction('ELIMINADA');
        setSuccessOpen(true);
        setSuccessMessage('Sucursal eliminada correctamente');
        setConfirmOpen(false); // Aquí se cierra la modal de confirmación después de eliminar la sucursal
      } catch (error) {
        console.error('Error al eliminar sucursal:', error);
      }
    }
  };

  const closeModal = () => {
    clearInputFields();
    setModalOpen(false);
    setSuccessOpen(false);
  };

  const clearInputFields = () => {
    setNumber('');
    setCity('');
    setName('');
    setMunicipality('');
    setState('');
    setPhone('');
    setSelectedBranch(null);
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

  const filteredBranches = branches.filter((branch) =>
    normalizeString(branch.name).toLowerCase().includes(normalizeString(searchTerm).toLowerCase())
  );

  const handlePhoneChange = (e: { target: { value: string; }; }) => {
    // Permitir solo números y limitar la longitud
    const formattedPhoneNumber = e.target.value.replace(/\D/g, '').slice(0, 20); // Elimina todo lo que no sea dígito y limita a 20 caracteres
    setPhone(formattedPhoneNumber);
  };

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
        LISTADO DE SUCURSALES
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
              <TableCell style={{ fontWeight: 700 }}>#</TableCell>
              <TableCell style={{ fontWeight: 700 }}>CIUDAD</TableCell>
              <TableCell style={{ fontWeight: 700 }}>MUNICIPIO</TableCell>
              <TableCell style={{ fontWeight: 700 }}>ESTADO</TableCell>
              <TableCell style={{ fontWeight: 700 }}>CELULAR</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBranches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((branch) => (
              <TableRow
                key={branch._id}
                onClick={() => openModal(branch._id, branch)}
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'inherit')}
              >
                <TableCell>{branch.name}</TableCell>
                <TableCell>{branch.number}</TableCell>
                <TableCell>{branch.city}</TableCell>
                <TableCell>{branch.municipality}</TableCell>
                <TableCell>{branch.state}</TableCell>
                <TableCell>{branch.phone}</TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredBranches.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={modalOpen} onClose={closeModal}>
        <DialogTitle>{selectedBranch ? 'Editar Sucursal' : 'Agregar Sucursal'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Nombre"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={localStorage.getItem('isAdmin') ==="Empleado" ? true : false}
          />
          <TextField
            margin="normal"
            label="# del local"
            variant="outlined"
            fullWidth
            multiline
            // rows={4}
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            disabled={localStorage.getItem('isAdmin') ==="Empleado" ? true : false}
          />
          <TextField
            margin="normal"
            label="Ciudad"
            variant="outlined"
            fullWidth
            multiline
            // rows={4}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={localStorage.getItem('isAdmin') ==="Empleado" ? true : false}
          />
          <TextField
            margin="normal"
            label="Municipio"
            variant="outlined"
            fullWidth
            multiline
            // rows={4}
            value={municipality}
            onChange={(e) => setMunicipality(e.target.value)}
            disabled={localStorage.getItem('isAdmin') ==="Empleado" ? true : false}
          />
          <TextField
            margin="normal"
            label="Estado"
            variant="outlined"
            fullWidth
            multiline
            // rows={4}
            value={state}
            onChange={(e) => setState(e.target.value)}
            disabled={localStorage.getItem('isAdmin') ==="Empleado" ? true : false}
          />
          <TextField
            margin="normal"
            label="Teléfono celular"
            variant="outlined"
            fullWidth
            multiline
            // rows={4}
            value={phone}
            // onChange={(e) => setPhone(e.target.value)}
            onChange={handlePhoneChange}
            inputProps={{ maxLength: 10, pattern: '[0-9]*' }} // Aquí se establece el máximo de caracteres permitidos
            disabled={localStorage.getItem('isAdmin') ==="Empleado" ? true : false}
          />
        </DialogContent>
        <DialogActions>
          {selectedBranch && (
            <Button onClick={() => setConfirmOpen(true)} variant="contained" color="error"
            disabled={localStorage.getItem('isAdmin') ==="Empleado" ? true : false}>
              Eliminar
            </Button>
          )}
          <Button onClick={closeModal} variant="outlined" color="primary">
            Cancelar
          </Button>
          <Button
            onClick={selectedBranch ? handleUpdateBranch : handleAddBranch}
            variant="contained"
            color="primary"
            disabled={!name || !number || !city || !municipality || !state || !phone || phone.length < 10 || localStorage.getItem('isAdmin') ==="Empleado" ? true : false}
          >
            {selectedBranch ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body1">¿Está seguro de que desea eliminar esta sucursal?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} variant="outlined" color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteBranch} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      <Button onClick={() => openModal('', null)} variant="contained" color="primary" 
        disabled={localStorage.getItem('isAdmin') ==="Empleado" ? true : false}>
        NUEVA
      </Button>
    </Container>
  );
};

export default BranchList;
