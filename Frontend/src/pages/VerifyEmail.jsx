import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import FadeIn from '../components/ui/FadeIn';
import { toast } from 'sonner';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { verifyOtp, resendOtp, user } = useAuthStore();
  const email = params.get('email') || '';
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputs = useRef([]);

  if (user) { navigate('/'); return null; }

  const handleChange = (i, v) => {
    if (v.length > 1) return;
    const newCode = [...code];
    newCode[i] = v;
    setCode(newCode);
    if (v && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const submit = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) { toast.error('Ingresa el código de 6 dígitos'); return; }
    setLoading(true);
    try {
      await verifyOtp({ email, code: fullCode });
      toast.success('¡Correo verificado!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Código incorrecto');
      setCode(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendOtp(email);
      toast.success('Código reenviado');
    } catch {
      toast.error('Error al reenviar');
    } finally {
      setResending(false);
    }
  };

  const handlePaste = (e) => {
    const text = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setCode(text.split(''));
      inputs.current[5]?.focus();
    }
  };

  return (
    <FadeIn>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-center gap-2 mb-8">
            <img src="/Platty-Logo.png" alt="Platty" className="h-10 w-10" />
            <h1 className="text-3xl font-bold gradient-text">Platty</h1>
          </div>
          <div className="glass-strong p-8 rounded-2xl text-center space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Verifica tu correo</h2>
              <p className="text-sm text-gray-500">Hemos enviado un código de 6 dígitos a</p>
              <p className="text-sm font-medium text-primary-600">{email}</p>
            </div>
            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {code.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-12 h-14 text-center text-xl font-bold input-field"
                />
              ))}
            </div>
            <Button className="w-full" loading={loading} onClick={submit}>
              Verificar
            </Button>
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-sm text-primary-600 hover:underline disabled:text-gray-400"
            >
              {resending ? 'Reenviando...' : 'Reenviar código'}
            </button>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
