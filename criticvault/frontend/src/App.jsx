import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Reviews from './pages/Reviews';
import Profile from './pages/Profile';
import ReviewDetail from './pages/ReviewDetail';
import EditReview from './pages/EditReview'; // <-- 1. Importe a nova página aqui
import CreateReview from './pages/CreateReview';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/review/:id" element={<ReviewDetail />} />
        <Route path="/editar-review/:id" element={<EditReview />} /> {/* <-- 2. Adicione a rota aqui */}
        <Route path="/nova-review" element={<CreateReview />} />
      </Routes>
    </Router>
  );
}

export default App;