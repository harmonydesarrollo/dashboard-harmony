import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { appointmentServices } from '../../../services/appointments/appointments';
import { Appointments, CreateAppointments, UpdateAppointments } from '../../types/appointments';
import { Services } from '../../types/serviceHarmony';
import { serviceServices } from '../../../services/serviceHarmony/service';
import { time } from 'console';

const hours = [
  '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30',
  '12:00'
];

const months = [
  { value: '01', label: 'Enero' },
  { value: '02', label: 'Febrero' },
  { value: '03', label: 'Marzo' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Mayo' },
  { value: '06', label: 'Junio' },
  { value: '07', label: 'Julio' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' },
];

const AppointmentListPage = () => {
  // services
  const [servicesList, setServicesList] = useState<Services[]>([]);
  const [searchDate, setSearchDate] = useState<string>('');
  const [searchName, setSearchName] = useState<string>('');
  const [searchStatus, setSearchStatus] = useState<string>('');

  const [open, setOpen] = useState(false);
  const [fullname, setFullname] = useState('');
  const [telephone, setTelephone] = useState('');
  const [service, setService] = useState('');
  const [modalTime, setModalTime] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('Pagado');
  const [appointments, setAppointments] = useState<Appointments[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointments | null>(null);
  const [searchDay, setSearchDay] = useState<string>('');
  const [searchMonth, setSearchMonth] = useState<string>('');
  const [searchTime, setSearchTime] = useState<string>('');
  const [isHourDisabled, setIsHourDisabled] = useState<boolean>(true);
  const [occupiedHours, setOccupiedHours] = useState<{ time: string; status: string }[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await appointmentServices.getAllAppointments('');
        setAppointments(response);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceServices.getAllServices('');
        setServicesList(response);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    filterOccupiedHours();
  }, [searchDay, searchMonth, searchTime, appointments]);

  useEffect(() => {
    setIsHourDisabled(searchDay === '' || searchMonth === '');
  }, [searchDay, searchMonth]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    
    const filteredAppointments = appointments.filter((appointment) =>
      appointment.date.includes(selectedDate)
    );
    
    const occupiedTimes = filteredAppointments.map((appointment) => ({ time: appointment.hour, status: appointment.status }));
    setOccupiedHours(occupiedTimes);
  };

  const handleOpen = () => {
    setOpen(true);
    clearFields();

    if (searchDay && searchMonth) {
      const formattedDate = `2024-${searchMonth}-${searchDay}`;
      setDate(formattedDate);

      const filteredAppointments = appointments.filter(
        (appointment) =>
          appointment.date.substring(8, 10) === searchDay &&
          appointment.date.substring(5, 7) === searchMonth
      );

      const occupiedTimes = filteredAppointments.map((appointment) => ({ time: appointment.hour, status: appointment.status }));

      let initialTime = '';

      if (searchTime) {
        const foundTime = occupiedTimes.find((time) => time.time === searchTime && !['Cancelado', 'Reprogramado'].includes(time.status));
        if (foundTime) {
          initialTime = searchTime;
        }
      }

      if (!initialTime) {
        initialTime = hours.find((hour) => {
          const foundTime = occupiedTimes.find((time) => time.time === hour && !['Cancelado', 'Reprogramado'].includes(time.status));
          return !foundTime;
        }) || '';
      }

      setModalTime(modalTime);
    } else {
      const today = new Date();
      const formattedDate = today.toISOString().slice(0, 10);
      setDate(formattedDate);

      setModalTime(hours[0]);
    }

    setStatus('Pagado');
  };

  const handleClose = () => {
    setOpen(false);
    clearFields();
  };

  const handleSaveAppointment = async () => {
    const newAppointment: CreateAppointments = {
      fullName: fullname,
      telephone,
      idService: service,
      hour: modalTime,
      date,
      status,
    };

    try {
      let response;
      if (selectedAppointment) {
        // Si hay una cita seleccionada, se está editando
        const updatedAppointment: UpdateAppointments = {
          _id: selectedAppointment._id,
          fullName: fullname,
          telephone,
          idService: service,
          date,
          hour: modalTime,
          status,
        };

        response = await appointmentServices.updateById(selectedAppointment._id, updatedAppointment, '');
      } else {
        // Si no hay una cita seleccionada, se está creando una nueva
        await appointmentServices.createAppointment(newAppointment, '');
      }

      const updatedAppointments = await appointmentServices.getAllAppointments('');
      setAppointments(updatedAppointments);

      clearFields();
      handleClose();
    } catch (error) {
      console.error('Error al guardar cita:', error);
    }
  };

  const handleEditAppointment = (appointment: Appointments) => {
    
    setSelectedAppointment(appointment);
    setFullname(appointment.fullName);
    setTelephone(appointment.telephone);
    setService(appointment.idService);
    setModalTime(appointment.hour);
    if (appointment.status === "Cancelado") {
      setDate('');
    } else {
      setDate(appointment.date);
    }
    if (appointment.status === "Reprogramado") {
      setModalTime('');
    }
    setStatus(appointment.status);
    setOpen(true);

    const filteredAppointments = appointments.filter((apt) => apt.date === appointment.date);
    const occupiedTimes = filteredAppointments.map((apt) => ({ time: apt.hour, status: apt.status }));

    setOccupiedHours(occupiedTimes);
  };

  const handleDayChange = (event: SelectChangeEvent<string>) => {
    setSearchDay(event.target.value);
  };

  const handleMonthChange = (event: SelectChangeEvent<string>) => {
    setSearchMonth(event.target.value);
  };


  const clearFields = () => {
    setFullname('');
    setTelephone('');
    setService('');
    setModalTime('');
    setDate('');
    setStatus('Pagado');
    setSelectedAppointment(null);
  };

  const filterOccupiedHours = () => {
    if (searchDay && searchMonth) {
      const filteredAppointments = appointments.filter((appointment) =>
        appointment.date.substring(8, 10) === searchDay &&
        appointment.date.substring(5, 7) === searchMonth
      );
      const occupiedHoursList: { time: string; status: string }[] = [];
      filteredAppointments.forEach((appointment) => {
        occupiedHoursList.push({ time: appointment.hour, status: appointment.status });
      });
      setOccupiedHours(occupiedHoursList);
    } else {
      setOccupiedHours([]);
    }
  };

  const filteredAppointments = appointments.filter((appointment) =>
    (!searchDay || appointment.date.substring(8, 10) === searchDay) &&
    (!searchMonth || appointment.date.substring(5, 7) === searchMonth) &&
    (!searchTime || appointment.hour === searchTime)
  );

  const isButtonDisabled = !searchDay || !searchMonth || !modalTime;

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h3" align="justify">
        LISTADO DE CITAS
      </Typography>
      <FormControl style={{ minWidth: '120px', marginRight: '20px', marginTop: '32px' }}>
        <InputLabel>Día</InputLabel>
        <Select
          value={searchDay}
          label="Día"
          onChange={handleDayChange}
        >
          <MenuItem value="">Todos</MenuItem>
          {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => (
            <MenuItem key={day} value={day.toString().padStart(2, '0')}>
              {day.toString().padStart(2, '0')}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl style={{ minWidth: '120px', marginRight: '20px', marginTop: '32px' }}>
        <InputLabel>Mes</InputLabel>
        <Select
          label='Mes'
          value={searchMonth}
          onChange={handleMonthChange}
        >
          <MenuItem value="">Todos</MenuItem>
          {months.map((month) => (
            <MenuItem key={month.value} value={month.value}>
              {month.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl style={{ minWidth: '120px', marginTop: '32px' }}>
        <InputLabel>Hora</InputLabel>
        <Select
          label='Hora'
          value={modalTime}
          onChange={(e) => setModalTime(e.target.value as string)}
          disabled={isHourDisabled}
        >
          {hours.map((hour) => (
            <MenuItem
              key={hour}
              value={hour}
              disabled={occupiedHours.some((time) => time.time === hour && !['Cancelado'].includes(time.status))}
              style={{ color: occupiedHours.some((time) => time.time === hour && !['Cancelado'].includes(time.status)) ? 'red' : 'green' }}
            >
              {hour}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
        <TableHead style={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell style={{ color: '#132A13', fontWeight: 'bold' }}>NOMBRE COMPLETO</TableCell>
              <TableCell style={{ color: '#132A13', fontWeight: 'bold' }}>TELÉFONO</TableCell>
              <TableCell style={{ color: '#132A13', fontWeight: 'bold' }}>SERVICIO</TableCell>
              <TableCell style={{ color: '#132A13', fontWeight: 'bold' }}>HORA</TableCell>
              <TableCell style={{ color: '#132A13', fontWeight: 'bold' }}>FECHA</TableCell>
              <TableCell style={{ color: '#132A13', fontWeight: 'bold' }}>ESTATUS</TableCell>
              <TableCell style={{ color: '#132A13', fontWeight: 'bold' }}>ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{
            margin:'auto',
            backgroundColor:'white'
          }}>
            {filteredAppointments.map((appointment) => (
              <TableRow key={appointment._id}>
                <TableCell>{appointment.fullName}</TableCell>
                <TableCell>{appointment.telephone}</TableCell>
                <TableCell>{appointment.service}</TableCell>
                <TableCell>{appointment.hour}</TableCell>
                <TableCell>{appointment.date}</TableCell>
                {/* <TableCell style={
                  { backgroundColor: appointment.status === 'Pagado' ? '#00D6B2' : appointment.status === 'Cancelado' ? '#FF5252' : appointment.status === 'Pendiente' ? '#73F2FF' : '#F9EC08' }
              }>
                  {appointment.status}
                </TableCell> */}
                <TableCell style={{
    // color: appointment.status === 'Pagado' ? '#00D6B2' :
    //                  appointment.status === 'Cancelado' ? '#FF5252' :
    //                  appointment.status === 'Pendiente' ? '#73F2FF' :
    //                  '#F9EC08',
    // backgroundColor: appointment.status === 'Pagado' ? '#00D6B2' :
    //                  appointment.status === 'Cancelado' ? '#FF5252' :
    //                  appointment.status === 'Pendiente' ? '#73F2FF' :
    //                  '#F9EC08',
    fontWeight:'bold',
    fontSize:'15'
}}>
    {appointment.status}
</TableCell>

                <TableCell>
                  <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => handleEditAppointment(appointment)}
                  style={{
                    backgroundColor: appointment.status === 'Pagado' ? '#00D6B2' :
                                     appointment.status === 'Cancelado' ? '#FF5252' :
                                     appointment.status === 'Pendiente' ? '#73F2FF' :
                                     '#F9EC08'}}
                  >
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        style={{ marginTop: '32px' }}
        disabled={isButtonDisabled}
      >
        NUEVO
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedAppointment ? 'Editar cita' : 'Nueva cita'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre completo"
            fullWidth
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            style={{
              marginBottom:'24px'
            }}
          />
          
          <TextField
            margin="dense"
            label="Teléfono"
            fullWidth
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            style={{
              marginBottom:'24px'
            }}
          />
          <FormControl fullWidth>
            <InputLabel>Servicio</InputLabel>
            <Select
              label='Servicio'
              value={service}
              style={{
                marginBottom:'24px'
              }}
              onChange={(e) => {
                const selectedServiceId = e.target.value as string;
                setService(selectedServiceId);
              }}
              fullWidth
            >
              {servicesList.map((s) => (
                <MenuItem key={s._id} value={s._id}>
                  {s.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Hora</InputLabel>
            <Select
              label='Hora'
              value={modalTime}
              onChange={(e) => setModalTime(e.target.value as string)}
              style={{
                marginBottom:'24px'
              }}
            >
              {hours.map((hour) => (
                <MenuItem
                  key={hour}
                  value={hour}
                  disabled={occupiedHours.some((time) => time.time === hour && !['Cancelado'].includes(time.status))}
                  style={{ color: occupiedHours.some((time) => time.time === hour && !['Cancelado'].includes(time.status)) ? 'red' : 'green' }}
                >
                  {hour}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Fecha"
            type="date"
            fullWidth
            value={date}
            onChange={handleDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            style={{
              marginBottom:'24px'
            }}
          />

          <FormControl fullWidth>
            <InputLabel>Estatus</InputLabel>
            <Select
              label='Estatus'
              value={status}
              onChange={(e) => setStatus(e.target.value as string)}
              fullWidth
              style={{
                marginBottom:'24px'
              }}
            >
              <MenuItem value="Pagado">Pagado</MenuItem>
              <MenuItem value="Cancelado">Cancelado</MenuItem>
              <MenuItem value="Reprogramado">Reprogramado</MenuItem>
              <MenuItem value="Pendiente">Pendiente</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error" variant="contained" >
            Cancelar
          </Button>
          <Button onClick={handleSaveAppointment} color="primary" variant="contained" 
          disabled= {!fullname || !telephone || !service || !hours || !date || !status || !modalTime}
          >
            Guardar Datos
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AppointmentListPage;
