import React, { useCallback, useEffect, useState } from 'react';
import TableComponent from '../../organisms/TableComponent';
import { Typography, Button, Box, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddEditPage from './AddEditPage';
import { employeeServices } from '../../../services/employees/employees';

const EmployeePage = () => {
  const navigate = useNavigate();
  const [showAddEdit, setshowAddEdit] = useState<boolean>(false);
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [dataEdit, setDataEdit] = useState<any>(null);
  const [employeesData, setEmployeesData] = useState<any[]>([]);

  const headers = ['_id', 'firstName', 'lastName', 'middleName', 'id_specialty', 'fullName', 'specialty', 'photo'];
  const headerTranslations: { [key: string]: string } = {
    id: 'ID',
    fullName: 'NOMBRE COMPLETO',
    specialty: 'ESPECIALIDAD',
    photo: 'FOTOGRAFÍA',
    firstName: 'Nombre',
    lastName: 'Apellido',
    middleName: 'Segundo nombre',
    idspecialty: 'id_specialty',
  };

  const fetchData = useCallback(async () => {
    try {
      const response: any = await employeeServices.getAllEmployees('', '', 0, 0);
      console.log(response);

      // Verificar si la respuesta es un array
      if (Array.isArray(response)) {
        // Mapear la respuesta para obtener los datos deseados
        const rows = response.map(
          (employee: {
            _id: any;
            firstName: any;
            lastName: any;
            middleName: any;
            id_specialty: any;
            fullName: any;
            specialty: any;
            photo: any;
          }) => [
            employee._id,
            employee.firstName,
            employee.lastName,
            employee.middleName,
            employee.id_specialty,
            employee.fullName,
            employee.specialty,
            employee.photo,
          ]
        );
        setEmployeesData(rows);
      } else {
        console.error('La respuesta no es un array:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const translatedHeaders = headers.map((header) => headerTranslations[header] || header);

  const handleRowClick = (rowData: any) => {
    console.log('Fila clickeada:', rowData);
    setshowAddEdit(true);
    setShowAdd(false);
    setDataEdit(rowData);
  };

  const handleAddNew = () => {
    setshowAddEdit(true);
    setShowAdd(true);
  };

  const handleCancel = () => {
    setshowAddEdit(false);
  };

  return (
    <div>
      {showAddEdit ? (
        <AddEditPage
          showAdd={showAdd}
          data={dataEdit}
          onSave={(formData: any) => {
            console.log('Datos guardados:', formData);
            setshowAddEdit(false);
          }}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h3" align="center">
              Listado de empleados
            </Typography>
            <Tooltip title="Agregar">
              <Button variant="contained" color="primary" onClick={handleAddNew} style={{ marginLeft: '10px' }}>
                Agregar
              </Button>
            </Tooltip>
          </Box>
          {employeesData && employeesData.length > 0 ? (
            <TableComponent headers={translatedHeaders} rows={employeesData} onRowClick={handleRowClick} />
          ) : (
            <Typography variant="body1">No hay datos de empleados disponibles {JSON.stringify(employeesData)}.</Typography>
          )}
        </>
      )}
    </div>
  );
};

export default EmployeePage;
