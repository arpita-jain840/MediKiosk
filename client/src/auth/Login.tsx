import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: (role: 'doctor' | 'patient') => void;
}

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();

  const handleLogin = (role: 'doctor' | 'patient') => {
    onLogin(role);
    if (role === 'doctor') {
      navigate('/doctor');
    } else {
      navigate('/patient');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-warm font-sans">
      <div className="bg-white p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-primary mb-3 tracking-tight">MediKiosk</h1>
        <p className="text-slate-500 mb-10 text-lg">Please select your portal</p>
        
        <div className="space-y-4">
          <button
            onClick={() => handleLogin('patient')}
            className="w-full py-4 rounded-2xl text-white font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Login as Patient
          </button>
          
          <button
            onClick={() => handleLogin('doctor')}
            className="w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            style={{ backgroundColor: "var(--color-primary-tint)", color: "var(--color-primary)" }}
          >
            Login as Doctor
          </button>
        </div>
      </div>
    </div>
  );
}
