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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TablePagination,
  Typography,
  Container,
  FormHelperText,
  Tooltip,
  Alert,
  AlertTitle,
  Stack,
} from '@mui/material';

import { userServices } from '../../../services/users/users';
import { specialtiesServices } from '../../../services/specialties/specialty';
import { CreateUsers, UpdateUsers, Users } from '../../types/users';
import { Specialties } from '../../types/specialties';
import { awsServices } from '../../../services/aws/aws';

const UserList = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const [action, setAction] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [middleName, setMiddleName] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [idSpecialty, setIdSpecialty] = useState<string>('');
  const [idBranch, setIdBranch] = useState<string>('');
  const [idRol, setIdRol] = useState<string>('');
  const [photo, setPhoto] = useState<string>('');
  const [updatePhoto, setUpdatePhoto] = useState<string>('');
  const [createdAt, setCreatedAt] = useState<string>('');
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [v, setV] = useState<number>(0);
  const [specialty, setSpecialty] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const closeSuccessMessage = () => {
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000); // 10000 milisegundos = 10 segundos
  };

  useEffect(() => {
    if (successMessage) {
      closeSuccessMessage();
    }
    const fetchUsers = async () => {
      try {
        const response = await userServices.getAllUsers('', '', page, rowsPerPage);
        setUsers(response);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [page, rowsPerPage]);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await specialtiesServices.getAllSpecialties('');
        setInitialSpecialties(response);
      } catch (error) {
        console.error('Error fetching specialties:', error);
      }
    };

    fetchSpecialties();
  }, []);

  const [initialSpecialties, setInitialSpecialties] = useState<Specialties[]>([]);

  const openModal = (userId: string, user: Users | null = null) => {
    const selectedUserData = users.find((u) => u._id === userId);

    if (selectedUserData) {
      setSelectedUser(selectedUserData);
      setSelectedUserId(userId);
      setFirstName(selectedUserData.firstName);
      setLastName(selectedUserData.lastName);
      setMiddleName(selectedUserData.middleName);
      setGender(selectedUserData.gender || '');
      setBirthday(selectedUserData.birthday || '');
      setFullName(selectedUserData.fullName);
      setIdSpecialty(selectedUserData.idSpecialty);
      setIdBranch(selectedUserData.idBranch);
      setIdRol(selectedUserData.idRol);
      setPhoto(selectedUserData.photo);
      setSelectedSpecialty(selectedUserData.idSpecialty); // Establecer el valor por defecto del Select
      setSpecialty(selectedUserData.specialty);
    } else {
      clearInputFields();
    }
    setModalOpen(true);
  };

  const handleAddUser = async () => {
    const newUser: CreateUsers = {
      firstName,
      lastName,
      middleName,
      fullName: `${firstName} ${lastName} ${middleName}`,
      idSpecialty: selectedSpecialty,
      photo: '', // Omitimos la foto aquí ya que la enviaremos por separado
      specialty,
    };
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];

      try {
        // Subir la foto al servicio S3
        const photoUrl: any = await awsServices.insertImgInS3(file, ''); //uploadImageToServer(file);

        // Agregar la URL de la foto al nuevo usuario
        newUser.photo = decodeURIComponent(photoUrl.fileUrl);
      } catch (error) {
        console.error('Error al agregar usuario:', error);
      }
    } else {
      newUser.photo = 'https://bucket-harmony.s3.amazonaws.com/defualt2.png';
    }
    // Crear el usuario con la foto y los demás datos
    await userServices.createUser(newUser, '');

    // Obtener la lista actualizada de usuarios después de agregar uno nuevo
    const updatedUsers = await userServices.getAllUsers('', '', page, rowsPerPage);

    // Actualizar el estado con la lista actualizada de usuarios
    setUsers(updatedUsers);

    // Limpiar los campos
    clearInputFields();

    // Cerrar el modal
    closeModal();

    // Mostrar ventana modal de éxito
    setAction('AGREGADO EXITOSAMENTE!!!');
    setSuccessOpen(true);
    setSuccessMessage('Usuario registrado.');
  };

  const handleUpdateUser = async () => {
    let auxPhoto = photo;
    const containsBucketHarmony = photo.includes('bucket-harmony');

    if (!containsBucketHarmony) {
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const photoUrl: any = await awsServices.insertImgInS3(file, '');
        auxPhoto = photoUrl.fileUrl;
      }
    }

    if (selectedUser) {
      const updateUser: UpdateUsers = {
        _id: selectedUser._id,
        gender,
        birthday,
        idBranch,
        idRol,
        firstName,
        lastName,
        middleName,
        fullName: `${firstName} ${lastName} ${middleName}`,
        idSpecialty: selectedSpecialty,
        photo: auxPhoto,
      };

      // jms
      await userServices.updateById(selectedUser._id, updateUser, '');

      const updatedUsers = users.map((user) =>
        user._id === selectedUser._id
          ? {
              ...user,
              firstName,
              lastName,
              middleName,
              gender,
              birthday,
              fullName: `${firstName} ${lastName} ${middleName}`,
              idSpecialty: selectedSpecialty,
              idBranch,
              idRol,
              photo,
              createdAt,
              updatedAt,
              __v: v,
              specialty,
            }
          : user
      );
      setUsers(updatedUsers);
      clearInputFields();
      closeModal();
      setAction('SE ACTUALIZÓ EXITOSAMENTE!!!');
      setSuccessOpen(true);
      setSuccessMessage('Usuario actualizado: ' + firstName + ' ' + lastName + ' ' + middleName);
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        // Eliminar el usuario del backend
        await userServices.deleteUser(selectedUser._id, '');

        // Filtrar la lista de usuarios para excluir al usuario eliminado
        const updatedUsers = users.filter((user) => user._id !== selectedUser._id);

        // Actualizar el estado con la lista filtrada de usuarios
        setUsers(updatedUsers);

        // Limpiar los campos y cerrar la modal
        clearInputFields();
        closeModal();

        // Mostrar ventana modal de éxito
        setAction('SE ELIMINO EXITOSAMENTE!!!');
        setSuccessOpen(true);
        setSuccessMessage('Usuario eliminado: ' + fullName);
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
      }
    }
  };

  const closeModal = () => {
    clearInputFields();
    setModalOpen(false);
    setSuccessOpen(false); // Ocultar el diálogo de éxito
  };

  const clearInputFields = () => {
    setSelectedUserId('');
    setFirstName('');
    setLastName('');
    setMiddleName('');
    setGender('');
    setBirthday('');
    setFullName('');
    setIdSpecialty('');
    setIdBranch('');
    setIdRol('');
    setPhoto('');
    setCreatedAt('');
    setUpdatedAt('');
    setV(0);
    setSpecialty('');
    setSelectedUser(null);
    setSelectedSpecialty('');
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

  const filteredUsers = users.filter((user) =>
    normalizeString(user.fullName).toLowerCase().includes(normalizeString(searchTerm).toLowerCase())
  );

  return (
    <Container component="main" maxWidth="md">
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
        LISTADO DE EMPLEADOS
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
              <TableCell style={{ fontWeight: 700 }}>NOMBRE COMPLETO</TableCell>
              <TableCell style={{ fontWeight: 700 }}>ESPECIALIDAD</TableCell>
              <TableCell style={{ fontWeight: 700 }}>FOTO</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <TableRow
                key={user._id}
                onClick={() => openModal(user._id, user)}
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'inherit')}
              >
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.specialty}</TableCell>
                <TableCell>
                  <img src={user.photo} alt="User" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={modalOpen}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            closeModal();
          }
        }}
      >
        <DialogTitle>{selectedUser ? 'Actualizar Usuario' : 'Agregar Nuevo Usuario'}</DialogTitle>
        <DialogContent style={{ maxWidth: '600px', overflow: 'hidden' }}>
          {/* Fila 1 */}
          <Box mb={2} display="flex" justifyContent="center"></Box>

          {/* Fila 2 */}
          <Box display="flex" justifyContent="space-between">
            {/* Columna 1 */}
            <Box width="450px" mr={2}>
              <Box mb={2}>
                <TextField label="Nombre" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth />
              </Box>
              <Box mb={2}>
                <TextField label="A. Paterno" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth />
              </Box>
              <Box mb={2}>
                <TextField
                  label="A. Materno"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  fullWidth
                />
              </Box>
              <Box>
                <FormControl fullWidth>
                  <Select
                    value={selectedSpecialty}
                    onChange={(e) => {
                      const selectedSpecialtyId = e.target.value as string;
                      const selectedSpecialtyName =
                        initialSpecialties.find((specialty) => specialty._id === selectedSpecialtyId)?.name || '';
                      setSelectedSpecialty(selectedSpecialtyId);
                      setSpecialty(selectedSpecialtyName); // Establecer el nombre de la especialidad en el estado specialty
                    }}
                  >
                    {initialSpecialties.map((specialty) => (
                      <MenuItem key={specialty._id} value={specialty._id}>
                        {specialty.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Seleccione una especialidad</FormHelperText>
                </FormControl>
              </Box>
            </Box>

            {/* Columna 2 */}
            <Box
              width="450px"
              height="270px"
              marginTop="10px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
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
                            setPhoto(reader.result.toString());
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label htmlFor="fileInput">
                    <img
                      src={photo || 'https://bucket-harmony.s3.amazonaws.com/defualt2.png'}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '270px',
                        cursor: 'pointer',
                        objectFit: 'fill',
                      }}
                    />
                  </label>
                </Box>
              </Tooltip>
            </Box>
          </Box>

          {/* Fila 3 */}
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={closeModal} variant="outlined" color="error">
              Cancelar
            </Button>
            {selectedUser ? (
              <>
                <Button
                  onClick={() => {
                    setConfirmOpen(true);
                    setAction('actualizar');
                  }}
                  variant="contained"
                  color="primary"
                  disabled={!firstName || !lastName || !selectedSpecialty}
                >
                  Actualizar
                </Button>
                <Button
                  onClick={() => {
                    setConfirmOpen(true);
                    setAction('eliminar');
                  }}
                  variant="contained"
                  color="error"
                >
                  Eliminar
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  setConfirmOpen(true);
                  setAction('agregar');
                }}
                variant="contained"
                color="primary"
                disabled={!firstName || !lastName || !middleName || !selectedSpecialty}
              >
                Agregar
              </Button>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>{`¿Estás seguro que deseas ${action}?`}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="error" variant="outlined">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (action === 'agregar') handleAddUser();
              if (action === 'eliminar') handleDeleteUser();
              if (action === 'actualizar') handleUpdateUser();
              setConfirmOpen(false);
            }}
            variant="contained"
            color="primary"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <br />
      <div>
        <Button variant="contained" color="primary" onClick={() => openModal(selectedUserId)}>
          Nuevo
        </Button>
      </div>
    </Container>
  );
};

export default UserList;
