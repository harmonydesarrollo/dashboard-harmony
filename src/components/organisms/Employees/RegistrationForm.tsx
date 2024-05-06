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
  { id: '160bf22baa062a91aef57aa1', value: '160bf22baa062a91aef57aa1', label: 'Fisioterapia General' },
  { id: '260bf22baa062a91aef57aa1', value: '260bf22baa062a91aef57aa1', label: 'Fisioterapia Ortopédica' },
  { id: '360bf22baa062a91aef57aa1', value: '360bf22baa062a91aef57aa1', label: 'Fisioterapia Neurológica' },
  // Agrega más opciones según sea necesario
];

const defaultImage =
  'https://static.vecteezy.com/system/resources/previews/025/379/576/non_2x/employee-avatar-profile-photo-icon-default-businessman-image-vector.jpg';

interface RegistrationFormProps {
  employeeData: any;
  onSave: (formData: any) => void;
  onCancel: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ employeeData, onSave, onCancel }) => {
  const navigate = useNavigate();

  // Inicializamos el estado del formulario con los datos proporcionados
  const [formData, setFormData] = useState({
    firstName: employeeData ? employeeData[1] : '',
    lastName: employeeData ? employeeData[2] : '',
    middleName: employeeData ? employeeData[3] : '',
    specialty: employeeData ? employeeData[4] : '',
    photo: employeeData ? employeeData[7] : '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.files) {
      // Verificar si es un input de tipo file y si tiene archivos seleccionados
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData((prevState) => ({
          ...prevState,
          photo: reader.result as string,
        }));
      };

      reader.readAsDataURL(file);
    } else {
      // Si no es un input de tipo file, simplemente actualizamos los valores del formulario
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Columna Izquierda */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Nombre" name="firstName" value={formData.firstName} onChange={handleChange} />
            <TextField
              fullWidth
              label="Apellido Paterno"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              style={{ marginTop: '16px' }}
            />
            <TextField
              fullWidth
              label="Apellido Materno"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              style={{ marginTop: '16px' }}
            />
            <FormControl fullWidth style={{ marginTop: '16px' }}>
              <Select
                labelId="specialty-label"
                value={formData.specialty}
                onChange={handleChange}
                name="specialty"
                displayEmpty
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
              <label htmlFor="photo-upload" style={{ display: 'block', marginBottom: '16px', cursor: 'pointer' }}>
                <img
                  src={formData.photo || defaultImage}
                  alt="Vista previa de la foto"
                  style={{
                    maxWidth: '100%',
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                  }}
                />
              </label>
              <Input type="file" id="photo-upload" onChange={handleChange} style={{ display: 'none' }} />
              <FormHelperText>Seleccione una foto para subir</FormHelperText>
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  {employeeData !== undefined ? 'ACTUALIZAR' : 'GUARDAR'}
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" color="primary" fullWidth onClick={handleCancel}>
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

export default RegistrationForm;
