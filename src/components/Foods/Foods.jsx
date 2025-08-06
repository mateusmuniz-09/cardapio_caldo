import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import Modal from "../Modal/Modal";
import {
  AiOutlineArrowLeft,
  AiOutlineClose,
  AiOutlineArrowRight,
} from "react-icons/ai";

import { FiShoppingCart } from "react-icons/fi";
import { BsWhatsapp } from "react-icons/bs";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Foods(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [enderecoOpen, setEnderecoOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [cart, setCart] = useState(() => {
    const carrinhoSalvo = localStorage.getItem("carrinho");
    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
  });
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [observacao, setObservacao] = useState("");

  const abrirModal = (food) => {
    setSelectedFood(food);
    setIsOpen(true);
  };

  const abrirCart = () => {
    setCartOpen(true);
  };

  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(cart));
  }, [cart]);

  const adcSucesso = (nomeProduto) => {
    toast.success(`${nomeProduto} adicionado com sucesso!`, {
      position: "top-right", // canto superior direito
      autoClose: 3000, // fecha sozinho em 3 segundos
      hideProgressBar: false, // mostra barra de progresso
      closeOnClick: true, // fecha ao clicar
      pauseOnHover: true, // pausa se passar o mouse
      draggable: true, // pode arrastar o alerta
      theme: "colored", // tema colorido
    });
  };

  const adicionarAoCarrinho = () => {
    if (!selectedFood) return;

    const existe = cart.find((item) => item.id === selectedFood.id);

    if (existe) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === selectedFood.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      );
    } else {
      setCart((prev) => [...prev, { ...selectedFood, quantidade: 1 }]);
    }
    adcSucesso(selectedFood.produto);

    setIsOpen(false);
  };

  const incrementar = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item
      )
    );
  };

  const diminuir = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, quantidade: item.quantidade - 1 } : item
        )
        .filter((item) => item.quantidade > 0)
    );
  };

  const estaForaDoHorario = () => {
    const agora = new Date();
    console.log(agora);
    const hora = agora.getHours();

    // Horário permitido: das 18h (inclusive) até 23h (inclusive)
    return hora < 9 || hora > 16;
  };

  const enviarPedido = () => {
    if (cart.length === 0) {
      toast.error("Seu carrinho está vazio!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }
    if (estaForaDoHorario()) {
      toast.error("Fora do horário de atendimento! Pedidos das 18h às 23h.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    if (!nome || !endereco || !bairro) {
      toast.error("Preencha todos os campos do endereço!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    const itensTexto = cart
      .map(
        (item) =>
          `• ${item.produto} x${item.quantidade} - R$ ${(
            item.preco * item.quantidade
          ).toFixed(2)}`
      )
      .join("\n");

    const total = cart.reduce(
      (soma, item) => soma + item.preco * item.quantidade,
      0
    );

    const mensagem = `*Novo Pedido:*\n\n${itensTexto}\n\n*Total:* R$ ${total.toFixed(
      2
    )}\n\n*Cliente:* ${nome}\n*Endereço:* ${endereco}\n*Bairro:* ${bairro}\n*Cidade:* ${observacao}`;

    const numeroWhatsApp = "5588981252883"; // coloque o número com DDD + 55 no começo
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
      mensagem
    )}`;

    window.open(url, "_blank");
    setCart([]);
    setNome("");
    setEndereco("");
    setBairro("");
    setObservacao("");
    setEnderecoOpen(false);
  };

  return (
    <div className="  flex justify-center items-center p-4 h-screen mb-40 ">
      <ToastContainer />
      <AnimatePresence>
        {isOpen && (
          <div className="z-50">
            <motion.div
              className="fixed inset-0 bg-[#000000d5] bg-opacity-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-6 shadow-xl w-[100%] max-w-[800px] h-screen relative flex flex-col items-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                {selectedFood && (
                  <>
                    <img
                      src={selectedFood.imagen}
                      alt={selectedFood.produto}
                      className="w-[280px] h-[280px] object-contain mb-10 rounded-xl shadow-lg shadow-gray-500"
                    />
                    <h2 className="text-2xl font-bold mb-4">
                      {selectedFood.produto}
                    </h2>
                    <p className="text-gray-600 mb-4 text-sm">
                      {selectedFood.description}
                    </p>
                    <p className="text-4xl font-bold">
                      R$ {selectedFood.preco.toFixed(2)}
                    </p>
                  </>
                )}
                <button
                  className="mt-8 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  onClick={adicionarAoCarrinho}
                >
                  Adicionar ao Carrinho
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-5 left-5 bg-gray-300 rounded-full p-1"
                >
                  <AiOutlineArrowLeft
                    size={30}
                    className="text-red-600 font-bold scale-[0.98]"
                  />
                </button>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <ul className="w-[100%] max-w-[800px] flex flex-col gap-2.5 ">
        <h2 className="mt-15 border-b font-semibold text-red-900 py-2">
          Nossos produtos{" "}
        </h2>
        {props.food.map((food) => (
          <li
            key={food.id}
            className="p-1 flex gap-2.5   border-b-1 border-gray-400 active:scale-[0.95] transition-all duration-300"
            onClick={() => abrirModal(food)}
          >
            <img
              src={food.imagen}
              alt="foto do produto"
              className="w-[70px] h-[70px] object-contain rounded-xl"
            />
            <div>
              <p className="font-semibold mb-1.5"> {food.produto}</p>
              <p className="text-xs mb-1.5 text-gray-500">{food.description}</p>
              <p className="text-lg font-bold">R${food.preco.toFixed(2)}</p>
            </div>
          </li>
        ))}
      </ul>

      <div
        className={`fixed p-3 flex top-0 justify-center items-center bg-[#000000da]  shadow-lg transition-all duration-500 ease-in-out transform z-40 ${
          cartOpen
            ? "opacity-100 scale-100 h-screen w-screen"
            : "opacity-0 scale-95 h-screen w-screen pointer-events-none"
        }`}
      >
        <div className="bg-gray-100 w-[100%] max-w-[500px] rounded-xl p-4 relative">
          <button
            onClick={() => setCartOpen(false)}
            className=" absolute mb-2 right-1 top-1 bg-gray-300 rounded-full p-1"
          >
            <AiOutlineClose
              size={24}
              className="text-red-600 font-bold scale-[0.98]"
            />
          </button>

          <h2 className="text-xl font-bold mb-5">🛒 Carrinho</h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">Nenhum item no carrinho.</p>
          ) : (
            <ul className="space-y-2">
              {cart.map((item) => (
                <li key={item.id} className="flex justify-between items-center">
                  <span className="text-sm md:text-base">{item.produto}</span>
                  <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>

                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                      onClick={() => diminuir(item.id)}
                    >
                      –
                    </button>
                    <span className="w-6 text-center">{item.quantidade}</span>
                    <button
                      className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                      onClick={() => incrementar(item.id)}
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {cart.length > 0 && (
            <div className="text-left font-bold text-lg mt-4 pt-2 border-t-2">
              Total: R${" "}
              {cart
                .reduce((soma, item) => soma + item.preco * item.quantidade, 0)
                .toFixed(2)}
            </div>
          )}

          {cart.length > 0 && (
            <button
              onClick={() => {
                setCartOpen(false);
                setEnderecoOpen(true);
              }}
              className="flex items-center gap-1 bg-gray-300 py-1 px-2 rounded-lg float-right mt-4"
            >
              <span>Avançar</span>{" "}
              <AiOutlineArrowRight size={24} className="text-green-700" />
            </button>
          )}
        </div>
      </div>

      <div
        className={`fixed p-4 bg-[#000000da] rounded top-0 shadow-lg transition-all duration-500 ease-in-out transform  flex justify-center items-center z-40 ${
          enderecoOpen
            ? "opacity-100 scale-100 h-screen w-screen"
            : "opacity-0 scale-95 h-screen w-screen pointer-events-none"
        }`}
      >
        <div className=" shadow-lg bg-gray-100 w-[100%] max-w-[500px] rounded-xl p-4 relative ">
          <button
            onClick={() => {
              setEnderecoOpen(false);
              setCartOpen(true);
            }}
            className="bg-gray-300 rounded-full p-1"
          >
            <AiOutlineArrowLeft
              size={30}
              className="text-red-600 font-bold scale-[0.98]"
            />
          </button>
          <h2 className="text-lg font-bold mb-2">Endereço de Entrega</h2>
          <input
            type="text"
            placeholder="Nome do cliente"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Rua, número..."
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Bairro"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Observação"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />

          <button
            onClick={enviarPedido}
            className="w-full mt-4 px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Enviar Pedido via WhatsApp
          </button>
        </div>
      </div>
      <div className="fixed bg-red-900 w-[100%] max-w-[800px] p-4 bottom-0 z-20 flex justify-around shadow-[0_-6px_12px_rgba(0,0,0,0.2)] shadow-gray-500 ">
        <button
          onClick={abrirCart}
          className="flex flex-col justify-center items-center relative gap-1 text-gray-300"
        >
          <FiShoppingCart size={28} />
          <span className="text-[12px]">Carrinho</span>

          {cart.length > 0 && (
            <span className="absolute -top-2 -right-0 bg-gray-300 text-red-700 font-bold w-5 h-5 rounded-full flex items-center justify-center text-xs">
              {cart.length}
            </span>
          )}
        </button>

        <button className="flex flex-col justify-center items-center relative gap-1 text-gray-300">
          <span>
            <BsWhatsapp size={24} />
          </span>
          <span className="text-[12px]">WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
export default Foods;
