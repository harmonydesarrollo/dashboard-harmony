import React, { useState, useEffect } from 'react';
import {  RadioGroup, Radio, FormControlLabel, Button, Grid } from '@mui/material';
import { DatePicker } from '@mui/lab';

interface FilterComponentProps {
  onFilterChange: (date: Date | null, filterType: 'day' | 'month') => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({ onFilterChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterType, setFilterType] = useState<'day' | 'month'>('day');

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    onFilterChange(date, filterType);
  };

  const handleFilterTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterType(event.target.value as 'day' | 'month');
    onFilterChange(selectedDate, event.target.value as 'day' | 'month');
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item>
        <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={handleDateChange}
          format="MM/dd/yyyy"
        />
      </Grid>
      <Grid item>
        <RadioGroup row value={filterType} onChange={handleFilterTypeChange}>
          <FormControlLabel value="day" control={<Radio />} label="Day" />
          <FormControlLabel value="month" control={<Radio />} label="Month" />
        </RadioGroup>
      </Grid>
    </Grid>
  );
};

export default FilterComponent;
