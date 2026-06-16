import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import FadeIn from '../components/ui/FadeIn';
import Stagger from '../components/ui/Stagger';
import { HiSparkles, HiBookOpen, HiHeart, HiShare, HiChartBar, HiArrowRight, HiChevronDown } from 'react-icons/hi';

const features = [
  { icon: HiBookOpen, title: 'Publica tus recetas', desc: 'Comparte tus creaciones con fotos, videos e instrucciones paso a paso.' },
  { icon: HiHeart, title: 'Guarda favoritas', desc: 'Crea tu colección personal y nunca pierdas una receta que te encantó.' },
  { icon: HiShare, title: 'Interactúa', desc: 'Comenta, califica y descubre nuevas recetas de toda la comunidad.' },
  { icon: HiChartBar, title: 'Inspírate', desc: 'Explora por categorías, tendencias y las mejor calificadas.' },
];

const stats = [
  { value: '10K+', label: 'Recetas compartidas' },
  { value: '5K+', label: 'Cocineros activos' },
  { value: '50K+', label: 'Calificaciones' },
];

export default function Landing() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="gradient-bg-animated absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="max-w-7xl mx-auto px-4 py-24 md:py-36 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <FadeIn className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm mb-6">
                <HiSparkles className="w-4 h-4" /> Red social de cocina
              </div>
              <div className="flex items-center gap-4 mb-6 justify-center md:justify-start">
                <img src="/Platty-Logo.png" alt="Platty" className="h-16 w-16 md:h-20 md:w-20 drop-shadow-2xl" />
                <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">Platty</h1>
              </div>
              <p className="text-2xl md:text-3xl font-medium text-white/90 mb-3">Cocina, postea y saborea.</p>
              <p className="text-base md:text-lg text-white/70 mb-10 max-w-xl mx-auto md:mx-0 leading-relaxed">
                La red social donde compartes tu pasión por la cocina. Publica recetas, descubre nuevas ideas y conecta con foodies como tú.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                {user ? (
                  <Button size="lg" className="bg-primary-400 text-primary-900 hover:bg-primary-300 shadow-xl hover:shadow-2xl hover:scale-105 transition-all" onClick={() => navigate('/explorar')}>
                    Explorar recetas <HiArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                ) : (
                  <Link to="/register"><Button size="lg" className="bg-primary-400 text-primary-900 hover:bg-primary-300 shadow-xl hover:shadow-2xl hover:scale-105 transition-all">Comenzar ahora <HiArrowRight className="ml-2 w-4 h-4" /></Button></Link>
                )}
              </div>
            </FadeIn>
            <FadeIn delay={0.2} className="flex-1 hidden md:flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
                <img src="/Platty-Logo.png" alt="Platty" className="w-72 h-72 md:w-96 md:h-96 object-contain relative z-10 drop-shadow-2xl animate-float" style={{ animation: 'float 6s ease-in-out infinite' }} />
              </div>
            </FadeIn>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-950 to-transparent" />
      </section>

      {/* Stats */}
      <section className="relative -mt-12 z-20 max-w-5xl mx-auto px-4">
        <FadeIn>
          <div className="glass-strong rounded-2xl p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 divide-x divide-gray-200 dark:divide-gray-700">
            {stats.map((s) => (
              <div key={s.label} className="text-center sm:first:pl-0 sm:pl-6">
                <p className="text-3xl md:text-4xl font-extrabold gradient-text">{s.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-widest">Funcionalidades</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">Todo lo que necesitas</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg">Una plataforma completa para compartir tu pasión por la cocina.</p>
          </div>
        </FadeIn>
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
          {features.map((f) => (
            <div key={f.title} className="card-hover p-8 text-center group">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <f.icon className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="font-semibold text-lg mb-3">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </Stagger>
      </section>

      {/* CTA */}
      {!user && (
        <section className="relative overflow-hidden">
          <div className="gradient-bg-animated absolute inset-0" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_60%)]" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 text-center">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">¿Listo para compartir tu sazón?</h2>
              <p className="text-white/80 mb-10 text-xl">Únete a Platty y forma parte de la comunidad culinaria más sabrosa.</p>
              <Link to="/register"><Button size="lg" className="bg-primary-400 text-primary-900 hover:bg-primary-300 shadow-xl hover:shadow-2xl hover:scale-105 transition-all">Crear cuenta gratis <HiArrowRight className="ml-2 w-4 h-4" /></Button></Link>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/Platty-Logo.png" alt="Platty" className="h-8 w-8" />
              <span className="font-bold text-lg gradient-text">Platty</span>
            </div>
            <p className="text-sm text-gray-500">Cocina, postea y saborea. &copy; {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
