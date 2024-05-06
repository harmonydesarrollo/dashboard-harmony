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

const AddEmployeePage = ({
  data,
  onSave,
  onCancel,
}: {
  data: EmployeeData | undefined;
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
        Agregar Empleado
      </Typography>
      <RegistrationForm employeeData={data} onSave={onSave} onCancel={onCancel} />
    </div>
  );
};

export default AddEmployeePage;
