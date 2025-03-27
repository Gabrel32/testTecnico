import Simulator from "../components/Simulator";
import DepositNow from "../components/DepositNow";
import logo from "../assets/logo/disrup.webp";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header con gradiente y sombra */}
      <header className="bg-gray-300 text-white p-4 shadow-lg">
        <div className="container mx-auto flex flex-col md:flex-row justify-center items-center px-4">
          <div className="flex items-center justify-center mb-4 md:mb-0">
            <img 
              src={logo} 
              width={150} 
              alt="Logo Disruptive Talent" 
              className="hover:scale-105 transition-transform duration-300"
            />
          </div>
            <DepositNow/>
        </div>
      </header>

      {/* Main content con animación de entrada */}
      <main className="flex-grow container mx-auto p-4 md:p-8 animate-fade-in">
        <div className="rounded-xl overflow-hidden p-6 md:p-8">
          <Simulator/>
        </div>
      </main>

      <footer className="bg-gray-300 text-slate-500 font-semibold py-4 text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm md:text-base">
            © {new Date().getFullYear()} Disruptive Talent. Todos los derechos reservados.
          </p>
         
        </div>
      </footer>

    </div>
  );
}

export default Layout;