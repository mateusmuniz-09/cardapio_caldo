import logo from "../../assets/img/logo.png"
import { BsWhatsapp,BsInstagram } from "react-icons/bs";
import { FaMotorcycle } from 'react-icons/fa'
import { MdLocationOn } from 'react-icons/md';
import { useEffect, useState } from 'react';


function Header(){

const [aberto, setAberto] = useState(false);
useEffect(() => {
    const agora = new Date();
    const diaSemana = agora.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const hora = agora.getHours();
    

    
    const horarioAbertura = 9; 
    const horarioFechamento = 18; 

   
    const abertoAgora =
     (diaSemana ===0 || diaSemana >= 2) && hora >= horarioAbertura && hora < horarioFechamento

    setAberto(abertoAgora);
  }, []);


return (
  <div className="mb-8">
    <header>
      <div className="bg-red-900 flex justify-between items-center py-1 px-5 text-white shadow-md shadow-gray-500">
        <img
          src={logo}
          alt="Logo"
          className="w-[100px] rounded-full object-cover "
        />
        <div className="flex items-center justify-center gap-4">
          <button>
            <BsWhatsapp size={28} />
          </button>
          <button>
            <BsInstagram size={28} />
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold text-red-900 p-2">Sopas e Caldos</h1>
        <div className="flex items-center justify-center gap-4 text-xs">
          <p className="flex items-center justify-center gap-1 font-semibold">
            <FaMotorcycle size={14} /> <span>20-30min</span>
          </p>
          <p className="flex items-center justify-center gap-1 font-semibold text-blue-800">
            <MdLocationOn size={14} />
            <a href="#">Localização</a>
          </p>
        </div>
        <div className="flex items-center justify-center gap-1 p-2">
          <span className="relative flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                aberto ? "bg-green-400" : "bg-red-400"
              } opacity-75`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                aberto ? "bg-green-600" : "bg-red-600"
              }`}
            ></span>
          </span>

          <p
            className={`font-semibold text-sm  ${
              aberto ? "text-green-700" : "text-red-700"
            }`}
          >
            {aberto ? "Estamos abertos" : "Estamos fechados"}
          </p>
        </div>
      </div>
    </header>
  </div>
);
}
export default Header;