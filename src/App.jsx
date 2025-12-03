import { Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome.jsx';
import { useSelector } from 'react-redux';
import RemovedStudent from './components/RemoveStudnet.jsx';
import StudentInterface from './pages/StudentInterface.jsx';


const App = () => {
      const { isKicked } = useSelector((state) => state.user);

    if (isKicked) {
        return <RemovedStudent />;
    }

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/student" element={<StudentInterface />} />
    </Routes>
  )
}

export default App
