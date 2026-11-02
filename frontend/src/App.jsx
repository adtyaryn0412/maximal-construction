import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import PublicLayout from './layouts/PublicLayout';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

import Login from './pages/public/Login';
import Register from './pages/public/Register';

import ProjectDetail from './pages/public/ProjectDetail';
import Beranda from './pages/public/Beranda';

import Dashboard from './pages/user/Dashboard';
import AjukanReservasi from './pages/user/AjukanReservasi';
import DetailReservasi from './pages/user/DetailReservasi';
import RiwayatReservasi from './pages/user/RiwayatReservasi';
import ProfilSaya from './pages/user/ProfilSaya';

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from './pages/admin/Dashboard';
import KelolaReservasi from './pages/admin/KelolaReservasi';
import DetailReservasiAdmin from './pages/admin/DetailReservasi';
import KelolaPortofolio from './pages/admin/KelolaPortofolio';
import FormProyek from './pages/admin/FormProyek';
import KelolaLayanan from './pages/admin/KelolaLayanan';
import KelolaTestimoni from './pages/admin/KelolaTestimoni';
import KelolaUser from './pages/admin/KelolaUser';
import DetailUser from './pages/admin/DetailUser';
import LogAktivitas from './pages/admin/LogAktivitas';

import ForcedLogoutModal from './components/ForcedLogoutModal';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ForcedLogoutModal />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Beranda />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/portofolio/:id" element={<ProjectDetail />} />
          </Route>

          <Route element={<UserLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reservasi/ajukan" element={<AjukanReservasi />} />
            <Route path="/reservasi/detail/:id" element={<DetailReservasi />} />
            <Route path="/reservasi" element={<RiwayatReservasi />} />
            <Route path="/profil" element={<ProfilSaya />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/reservasi" element={<KelolaReservasi />} />
            <Route path="/admin/reservasi/:id" element={<DetailReservasiAdmin />} />
            <Route path="/admin/portofolio" element={<KelolaPortofolio />} />
            <Route path="/admin/portofolio/tambah" element={<FormProyek />} />
            <Route path="/admin/portofolio/:id/edit" element={<FormProyek />} />
            <Route path="/admin/layanan" element={<KelolaLayanan />} />
            <Route path="/admin/testimoni" element={<KelolaTestimoni />} />
            <Route path="/admin/user" element={<KelolaUser />} />
            <Route path="/admin/user/:id" element={<DetailUser />} />
            <Route path="/admin/log" element={<LogAktivitas />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;