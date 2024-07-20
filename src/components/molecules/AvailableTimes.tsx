import React, { useState, useEffect } from 'react';
import { Button, Grid, Typography } from '@mui/material';

interface AvailableTimesProps {
  selectedDate: Date | null;
  appointments: { date: Date; time: string }[];
}

const AvailableTimes: React.FC<AvailableTimesProps> = ({ selectedDate, appointments }) => {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  useEffect(() => {
    if (selectedDate) {
      // Lógica para generar todos los horarios disponibles para el día seleccionado
      const allTimes = ['08:00', '08:30', '09:00', '09:30', '10:00', /* ... */];
      // Filtrar los horarios que ya están ocupados
      const occupiedTimes = appointments
        .filter(appointment => appointment.date.getTime() === selectedDate.getTime())
        .map(appointment => appointment.time);
      const filteredTimes = allTimes.filter(time => !occupiedTimes.includes(time));
      setAvailableTimes(filteredTimes);
    }
  }, [selectedDate, appointments]);

  const handleTimeSelection = (time: string) => {
    // Lógica para manejar la selección de horario
    // console.log('Selected time:', time);
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item>
        <Typography variant="subtitle1">Available Times:</Typography>
        {availableTimes.length === 0 ? (
          <Typography variant="body2">No available times for selected date.</Typography>
        ) : (
          <Grid container spacing={1}>
            {availableTimes.map(time => (
              <Grid item key={time}>
                <Button
                  variant="outlined"
                  disabled={false} 
                  onClick={() => handleTimeSelection(time)}
                >
                  {time}
                </Button>
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default AvailableTimes;
