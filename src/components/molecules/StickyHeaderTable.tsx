import React, { useState } from 'react';
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TablePagination,
  TextField,
  Modal,
  Button,
  Box,
  Typography,
} from '@mui/material';
import '../styles/components/molecules/StickyHeaderTable.css';
import { useNavigate } from 'react-router-dom';

interface StickyHeaderTableProps {
  headers: string[];
  rows: (string | number)[][];
  onRowClick: (rowData: (string | number)[]) => void;
}

const StickyHeaderTable: React.FC<StickyHeaderTableProps> = ({ headers, rows, onRowClick }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRows, setFilteredRows] = useState(rows);
  const [deleteRowData, setDeleteRowData] = useState<{
    index: number | null;
    userId: string | null;
    username: string | null;
  }>({
    index: null,
    userId: null,
    username: null,
  });
  const [editRowData, setEditRowData] = useState<{
    index: number | null;
    userId: string | null;
    username: string | null;
  }>({
    index: null,
    userId: null,
    username: null,
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = removeAccents(event.target.value.toLowerCase());
    setSearchTerm(term);
    const filtered = rows.filter((row) => row.some((cell) => removeAccents(String(cell).toLowerCase()).includes(term)));
    setFilteredRows(filtered);
  };

  const removeAccents = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const handleDeleteRow = (rowIndex: number, userId: string, username: string) => {
    setDeleteRowData({ index: rowIndex, userId: userId, username: username });
  };

  const handleEditRow = (rowIndex: number, editEmployee: any) => {
    const dataEmployee = {
      firstName: editEmployee.firstName,
      lastName: editEmployee.lastName,
      middleName: editEmployee.middleName,
      specialty: editEmployee.specialty,
      photo: editEmployee.photo,
    };

    // Navega a la ruta '/editEmployee' y pasa los valores como parte del objeto de estado
    // navigate('/editEmployee', { state: { employee: dataEmployee } });
    // navigate('/editEmployee');

    // setEditRowData({ index: rowIndex, userId: userId, username: username });
  };

  const handleConfirmDelete = (userId: string | null, username: string | null) => {
    if (deleteRowData.index !== null) {
      const updatedRows = [...filteredRows];
      updatedRows.splice(deleteRowData.index, 1);
      setFilteredRows(updatedRows);
      setDeleteRowData({ index: null, userId: null, username: null }); // Resetear el estado del índice de fila seleccionada
      
    }
  };

  const handleConfirmEdit = () => {
    // Aquí puedes implementar la lógica para editar la fila, por ejemplo, abrir un modal de edición o enviar los datos al servidor
    // Después de editar, reseteamos el estado de editRowData
    setEditRowData({ index: null, userId: null, username: null });
  };

  const handleCancelEdit = () => {
    // Simplemente reseteamos el estado de editRowData
    setEditRowData({ index: null, userId: null, username: null });
  };

  const handleCancelDelete = () => {
    setDeleteRowData({ index: null, userId: null, username: null }); // Resetear el estado del índice de fila seleccionada
  };

  return (
    <>
      <TextField
        label="Buscar"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: '16px' }}
      />
      <TableContainer
        component={Paper}
        style={{ maxHeight: 400, border: '1px solid #CBCBCB', boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)' }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {headers.slice(5).map((header, index) => (
                <TableCell key={index} style={{ fontWeight: 700, backgroundColor: '#F7F9A8' }}>
                  {header}
                </TableCell>
              ))}
              <TableCell style={{ fontWeight: 700, backgroundColor: '#F7F9A8' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(rowsPerPage > 0
              ? filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredRows
            ).map((row, rowIndex) => (
              // <TableRow key={rowIndex} className="hover-hand" onClick={() => onRowClick(row)}>
              <TableRow key={rowIndex} className="hover-hand">
                {row.slice(5).map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>
                    {typeof cell === 'string' && cell.match(/\.(jpeg|jpg|gif|png)$/) ? (
                      <img src={cell} alt="Imagen" style={{ maxWidth: '100%', maxHeight: '100px' }} />
                    ) : (
                      cell
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <Button onClick={() => onRowClick(row)} color="primary">
                    Editar
                  </Button>
                  <Button onClick={() => handleDeleteRow(rowIndex, row[0] as string, row[1] as string)} color="error">
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, { label: 'Todas', value: -1 }]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        labelRowsPerPage="Filas por página"
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Modal open={deleteRowData.index !== null} onClose={handleCancelDelete}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'white',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            maxWidth: 400,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" gutterBottom>
            ¿Estás seguro de que quieres eliminar a {deleteRowData.username}?
          </Typography>
          <Button
            onClick={() => handleConfirmDelete(deleteRowData.userId, deleteRowData.username)}
            color="error"
            variant="contained"
            style={{ marginRight: '8px' }}
          >
            Confirmar
          </Button>

          <Button onClick={handleCancelDelete} variant="outlined">
            Cancelar
          </Button>
        </Box>
      </Modal>
      <Modal open={editRowData.index !== null} onClose={handleCancelEdit}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'white',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            maxWidth: 400,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Editar usuario con ID: {editRowData.userId}
          </Typography>
          {/* Aquí podrías agregar los campos de edición, como inputs, selectores, etc. */}
          <Button onClick={handleConfirmEdit} color="primary" variant="contained" style={{ marginRight: '8px' }}>
            Confirmar
          </Button>
          <Button onClick={handleCancelEdit} variant="outlined">
            Cancelar
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default StickyHeaderTable;
