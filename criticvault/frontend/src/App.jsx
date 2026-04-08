import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Reviews from './pages/Reviews';
import Profile from './pages/Profile';
import ProfileSettings from './pages/ProfileSettings';
import ReviewDetail from './pages/ReviewDetail';
import EditReview from './pages/EditReview';
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
        <Route path="/perfil/settings" element={<ProfileSettings />} />
        <Route path="/review/:id" element={<ReviewDetail />} />
        <Route path="/editar-review/:id" element={<EditReview />} />
        <Route path="/nova-review" element={<CreateReview />} />
      </Routes>
    </Router>
  );
}

export default App;