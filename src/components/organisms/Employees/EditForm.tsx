import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Input,
  FormControl,
  FormHelperText,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';

const options = [
  { id: 1, value: 'fisio', label: 'Fisioterapia' },
  { id: 2, value: 'med', label: 'Medicina' },
  // Agrega más opciones según sea necesario
];

const defaultImage =
  'https://static.vecteezy.com/system/resources/previews/025/379/576/non_2x/employee-avatar-profile-photo-icon-default-businessman-image-vector.jpg';

const EditForm: React.FC<{ employeeData: any }> = ({ employeeData }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>({
    employeeData,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Columna Izquierda */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Nombre" name="firstName" value={formData[0]} onChange={handleChange} />
            <TextField
              fullWidth
              label="Apellido Paterno"
              name="lastName"
              value={formData[1]}
              onChange={handleChange}
              style={{ marginTop: '16px' }} // Agrega espaciado entre los inputs
            />
            <TextField
              fullWidth
              label="Apellido Materno"
              name="middleName"
              value={formData[2]}
              onChange={handleChange}
              style={{ marginTop: '16px' }} // Agrega espaciado entre los inputs
            />
            <FormControl fullWidth style={{ marginTop: '16px' }}>
              <Select
                value={formData[3]}
                onChange={handleChange}
                name="specialty"
                displayEmpty
                inputProps={{ id: 'specialty' }}
              >
                <MenuItem value="" disabled>
                  Seleccione una especialidad
                </MenuItem>
                {options.map((option) => (
                  <MenuItem key={option.id} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Seleccione una especialidad</FormHelperText>
            </FormControl>
          </Grid>
          {/* Columna Derecha */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              {/* Utiliza una etiqueta label para mostrar el botón de selección de foto */}
              <label htmlFor="photo-upload" style={{ display: 'block', marginBottom: '16px', cursor: 'pointer' }}>
                <img
                  src={formData[4] || defaultImage}
                  alt="Vista previa de la foto"
                  style={{
                    maxWidth: '100%',
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover', // Establece el estilo de "cover"
                  }}
                />
              </label>
              <Input type="file" id="photo-upload" onChange={handleChange} style={{ display: 'none' }} />
              <FormHelperText>Seleccione una foto para subir</FormHelperText>
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Actualizar
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    navigate('/employees');
                  }}
                >
                  Cancelar
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default EditForm;
