import React, { useState } from 'react';
import { Typography } from '@mui/material';
import RegistrationForm from '../../organisms/Employees/RegistrationForm';

// Define una interfaz para especificar el tipo de 'data'
interface EmployeeData {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  specialty: string;
  photo: string;
}

const EditEmployeePage = ({
  data,
  onSave,
  onCancel,
}: {
  data: EmployeeData;
  onSave: (formData: EmployeeData) => void;
  onCancel: () => void;
}) => {
  return (
    <div>
      <Typography
        variant="h3"
        align="center"
        style={{
          marginTop: '3%',
          marginBottom: '5%',
        }}
      >
        Editar Empleado
      </Typography>
      <RegistrationForm employeeData={data} onSave={onSave} onCancel={onCancel} />
    </div>
  );
};

export default EditEmployeePage;
