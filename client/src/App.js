import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className='pt-4 text-white container mx-auto px-4'>
      <Navbar />
      <Dashboard />
    </div>
  );
}

export default App;
