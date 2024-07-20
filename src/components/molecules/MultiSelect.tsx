// import React, { useState } from 'react';
// import { Select, MenuItem, FormControl, FormHelperText, Box } from '@mui/material';
// import { SelectChangeEvent } from '@mui/material/Select';

// interface Props {
//   onChange: (selected: string[]) => void;
// }

// interface Branch {
//   _id: string;
//   name: string;
// }

// const initialBranches: Branch[] = [
//   { _id: '111', name: 'Sucursal 1' },
//   { _id: '222', name: 'Sucursal 2' },
//   { _id: '333', name: 'Sucursal 3' },
//   { _id: '444', name: 'Sucursal 4' },
// ];

// const MultiSelectBranches: React.FC<Props> = ({ onChange }) => {
//   const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

//   const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
//     const selected = event.target.value as string[];
//     setSelectedBranches(selected);
//     onChange(selected);
//   };

//   return (
//     <Box>
//       <FormControl fullWidth>
//         <Select
//           multiple
//           value={selectedBranches}
//           onChange={handleChange as (event: SelectChangeEvent<string[]>) => void} // Casting explícito al tipo SelectChangeEvent<string[]>
//           renderValue={(selected) => (
//             <div>
//               {selected.map((value) => (
//                 <span key={value}>{initialBranches.find((branch) => branch._id === value)?.name}, </span>
//               ))}
//             </div>
//           )}
//         >
//           {initialBranches.map((branch) => (
//             <MenuItem key={branch._id} value={branch._id}>
//               {branch.name}
//             </MenuItem>
//           ))}
//         </Select>
//         <FormHelperText>Seleccione una o más sucursales</FormHelperText>
//       </FormControl>
//     </Box>
//   );
// };

// export default MultiSelectBranches;


import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, FormHelperText, Box } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

interface Props {
  onChange: (selected: string[]) => void;
  selectedValues: string[];
}

interface Branch {
  _id: string;
  name: string;
}

const initialBranches: Branch[] = [
  { _id: '111', name: 'Sucursal 1' },
  { _id: '222', name: 'Sucursal 2' },
  { _id: '333', name: 'Sucursal 3' },
  { _id: '444', name: 'Sucursal 4' },
];

const MultiSelectBranches: React.FC<Props> = ({ onChange, selectedValues }) => {
  const [selectedBranches, setSelectedBranches] = useState<string[]>(selectedValues);

  useEffect(() => {
    setSelectedBranches(selectedValues);
  }, [selectedValues]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selected = event.target.value as string[];
    setSelectedBranches(selected);
    onChange(selected);
  };

  return (
    <Box>
      <FormControl fullWidth>
        <Select
          multiple
          value={selectedBranches}
          onChange={handleChange as (event: SelectChangeEvent<string[]>) => void} // Casting explícito al tipo SelectChangeEvent<string[]>
          renderValue={(selected) => (
            <div>
              {selected.map((value) => (
                <span key={value}>{initialBranches.find((branch) => branch._id === value)?.name}, </span>
              ))}
            </div>
          )}
        >
          {initialBranches.map((branch) => (
            <MenuItem key={branch._id} value={branch._id}>
              {branch.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Seleccione una o más sucursales</FormHelperText>
      </FormControl>
    </Box>
  );
};

export default MultiSelectBranches;
