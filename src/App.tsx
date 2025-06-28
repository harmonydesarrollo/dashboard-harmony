import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/organisms/LoginPage';
import AdminTemplate from './components/templates/AdminTemplate';
import AppointmentList from './components/pages/Appointments/AppointmentListPage';
import UserList from './components/pages/Users/UserListPage';
import ReviewList from './components/pages/Reviews/ReviewListPage';
import PartnerList from './components/pages/Partners/PartnerListPage';
import TreatmentList from './components/pages/Treatments/TreatmentsListPage';
import ServiceList from './components/pages/ServicesHarmony/ServiceListPage';
import VideoList from './components/pages/Videos/VideosListPage';
import QuestionList from './components/pages/Questions/QuestionListPage';
import BranchList from './components/pages/Branches/BranchesListPage';
import PrivateRoute from './components/organisms/PrivateRoute';
import MatriceList from './components/pages/Matrices/MatriceListPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/employee" element={<AdminTemplate><UserList /></AdminTemplate>} />
          <Route path="/reviews" element={<AdminTemplate><ReviewList /></AdminTemplate>} />
          <Route path="/partners" element={<AdminTemplate><PartnerList /></AdminTemplate>} />
          <Route path="/treatments" element={<AdminTemplate><TreatmentList /></AdminTemplate>} />
          <Route path="/services" element={<AdminTemplate><ServiceList /></AdminTemplate>} />
          <Route path="/videos" element={<AdminTemplate><VideoList /></AdminTemplate>} />
          <Route path="/questions" element={<AdminTemplate><QuestionList /></AdminTemplate>} />
          <Route path="/branches" element={<AdminTemplate><BranchList /></AdminTemplate>} />
          <Route path="/appointment" element={<AdminTemplate><AppointmentList /></AdminTemplate>} />
          <Route path="/matrices" element={<AdminTemplate><MatriceList /></AdminTemplate>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
