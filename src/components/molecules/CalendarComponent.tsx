import React, { useState, useEffect } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { format } from 'date-fns';
import { SelectChangeEvent } from '@mui/material';

interface Appointment {
  id: string;
  date: Date;
  eventName: string;
  personName: string;
  phoneNumber: string;
  serviceType: { name: string; _id: string };
}

const serviceTypes = [
  { name: 'Consulta', _id: '1' },
  { name: 'Revisión', _id: '2' },
  { name: 'Tratamiento', _id: '3' },
  { name: 'Otro', _id: '4' }
];

const CalendarComponent: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [eventName, setEventName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [selectedService, setSelectedService] = useState<{ name: string; _id: string } | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const storedAppointments = localStorage.getItem('appointments');
    if (storedAppointments) {
      setAppointments(JSON.parse(storedAppointments));
    }
  }, []);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      setSelectedDate(localDate);
      setSelectedHour(null);
    } else {
      setSelectedDate(null);
      setSelectedHour(null);
    }
  };

  const handleHourChange = (event: SelectChangeEvent<string | number | readonly string[] | undefined>) => {
    const value = event.target.value as number | null;
    setSelectedHour(typeof value === 'number' ? value : null);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEventName('');
    setPhoneNumber('');
    setSelectedService(null);
    setSelectedHour(null);
  };

  const handleEventSubmit = () => {
    if (selectedDate && selectedHour !== null && selectedService && eventName.trim() !== '' && phoneNumber.trim() !== '') {
      const selectedDateTime = new Date(selectedDate);
      selectedDateTime.setHours(selectedHour);

      const isAppointmentConflict = appointments.some(appointment =>
        format(appointment.date, 'yyyy-MM-dd HH:mm') === format(selectedDateTime, 'yyyy-MM-dd HH:mm')
      );

      if (isAppointmentConflict) {
        alert('La hora seleccionada ya está ocupada para esta fecha. Por favor selecciona otra hora.');
        return;
      }

      const newAppointment: Appointment = {
        id: new Date().getTime().toString(),
        date: selectedDateTime,
        eventName: eventName,
        personName: '',
        phoneNumber: phoneNumber,
        serviceType: selectedService
      };
      const updatedAppointments = [...appointments, newAppointment];
      setAppointments(updatedAppointments);
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    } else {
      alert('Por favor completa todos los campos.');
    }
    handleDialogClose();
  };

  const renderTimeOptions = () => {
    const options = [];
    const startHour = 8;
    const endHour = 18;
    const interval = 30;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const dateTime = selectedDate ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), hour, minute) : new Date();
        const isAvailable = !appointments.some(appointment =>
          format(appointment.date, 'yyyy-MM-dd HH:mm') === format(dateTime, 'yyyy-MM-dd HH:mm')
        );
        options.push(
          <MenuItem key={time} value={hour + minute / 60} disabled={!isAvailable}>
            {time}
          </MenuItem>
        );
      }
    }
    return options;
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" style={{ marginBottom: '20px' }}>Calendario de Eventos</Typography>

      <div style={{ marginTop: '30px' }}>
        <Typography variant="h5">Citas Agendadas:</Typography>
        <table style={{ width: '100%', marginTop: '10px' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ddd' }}>Fecha</th>
              <th style={{ borderBottom: '1px solid #ddd' }}>Hora</th>
              <th style={{ borderBottom: '1px solid #ddd' }}>Nombre del Evento</th>
              <th style={{ borderBottom: '1px solid #ddd' }}>Teléfono</th>
              <th style={{ borderBottom: '1px solid #ddd' }}>Tipo de Servicio</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td style={{ borderBottom: '1px solid #ddd' }}>{format(appointment.date, 'dd/MM/yyyy')}</td>
                <td style={{ borderBottom: '1px solid #ddd' }}>{format(appointment.date, 'HH:mm')}</td>
                <td style={{ borderBottom: '1px solid #ddd' }}>{appointment.eventName}</td>
                <td style={{ borderBottom: '1px solid #ddd' }}>{appointment.phoneNumber}</td>
                <td style={{ borderBottom: '1px solid #ddd' }}>{appointment.serviceType ? appointment.serviceType.name : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button
        onClick={handleDialogOpen}
        variant="contained"
        color="primary"
        style={{ marginTop: '20px' }}
      >
        Nuevo
      </Button>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Registrar Evento</DialogTitle>
        <DialogContent>
          <TextField
            label="Selecciona una fecha"
            type="date"
            value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
            onChange={(e) => handleDateChange(e.target.value ? new Date(e.target.value) : null)}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            style={{ marginBottom: '20px' }}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="hour-select-label">Hora</InputLabel>
                <Select
                  labelId="hour-select-label"
                  id="hour-select"
                  value={selectedHour || ''}
                  onChange={(e: SelectChangeEvent<string | number | readonly string[] | undefined>) => handleHourChange(e)}
                  fullWidth
                >
                  {renderTimeOptions()}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="service-type-label">Tipo de Servicio</InputLabel>
                <Select
                  labelId="service-type-label"
                  id="service-type"
                  value={selectedService ? { value: selectedService._id } : undefined}
                  onChange={(e: SelectChangeEvent<{ value: unknown }>) => {
                    const selectedType = serviceTypes.find(type => type._id === e.target.value);
                    setSelectedService(selectedType || null);
                  }}
                  fullWidth
                >
                  {serviceTypes.map(type => (
                    <MenuItem key={type._id} value={type._id}>{type.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <TextField
            label="Nombre del Evento"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            fullWidth
            style={{ marginBottom: '20px', marginTop: '20px' }}
          />

          <TextField
            label="Teléfono"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
            style={{ marginBottom: '20px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleEventSubmit} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CalendarComponent;
