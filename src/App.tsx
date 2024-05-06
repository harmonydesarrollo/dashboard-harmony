// // App.tsx
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LoginPage from './components/organisms/LoginPage';
// import HomePage from './components/pages/HomePage';
// import FluidTemplate from './components/templates/FluidTemplate';

// const App: React.FC = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route
//           path="/home"
//           element={
//             <FluidTemplate>
//               <HomePage />
//             </FluidTemplate>
//           }
//         />

//         {/* Otros rutas */}
//       </Routes>
//     </Router>
//   );
// };

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LoginPage from './components/pages/LoginPage';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/organisms/LoginPage';
import AdminTemplate from './components/templates/AdminTemplate';
import AppointmentPage from './components/pages/Appointments/AppointmentPage';

import UserList from './components/pages/Users/UserListPage';
import ReviewList from './components/pages/Reviews/ReviewListPage';
import PartnerList from './components/pages/Partners/PartnerListPage';
import TreatmentList from './components/pages/Treatments/TreatmentsListPage';
import ServiceList from './components/pages/ServicesHarmony/ServiceListPage';
// import AppTemplate from './components/templates/AppTemplate'; // Importa la plantilla principal

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <AdminTemplate>
              <div style={{ margin: '0% 5% 10% 5%' }}>
                <UserList />
              </div>
            </AdminTemplate>
          }
        />
        <Route
          path="/reviews"
          element={
            <AdminTemplate>
              <div style={{ margin: '0% 5% 10% 5%' }}>
                <ReviewList />
              </div>
            </AdminTemplate>
          }
        />
        <Route
          path="/partners"
          element={
            <AdminTemplate>
              <div style={{ margin: '0% 5% 10% 5%' }}>
                <PartnerList />
              </div>
            </AdminTemplate>
          }
        />
        <Route
          path="/treatments"
          element={
            <AdminTemplate>
              <div style={{ margin: '0% 5% 10% 5%' }}>
                <TreatmentList />
              </div>
            </AdminTemplate>
          }
        />
        <Route
          path="/services"
          element={
            <AdminTemplate>
              <div style={{ margin: '0% 5% 10% 5%' }}>
                <ServiceList />
              </div>
            </AdminTemplate>
          }
        />

        {/* Otras rutas */}
      </Routes>
    </Router>
  );
};

export default App;
