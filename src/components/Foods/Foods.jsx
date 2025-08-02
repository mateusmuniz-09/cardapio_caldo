import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../Modal/Modal";

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
  const [cidade, setCidade] = useState("");

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

  const adicionarAoCarrinho = () => {
    if (!selectedFood) return;

    // verifica se o item já está no carrinho
    const existe = cart.find((item) => item.id === selectedFood.id);

    if (existe) {
      // se já existe, aumenta a quantidade
      setCart((prev) =>
        prev.map((item) =>
          item.id === selectedFood.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      );
    } else {
      // se não existe, adiciona com quantidade 1
      setCart((prev) => [...prev, { ...selectedFood, quantidade: 1 }]);
    }

    setIsOpen(false); // fecha o modal após adicionar
  };

  const incrementar = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item
      )
    );
  };

  const diminuir = (id) => {
    setCart(
      (prevCart) =>
        prevCart
          .map((item) =>
            item.id === id ? { ...item, quantidade: item.quantidade - 1 } : item
          )
          .filter((item) => item.quantidade > 0) // remove item se a quantidade for 0
    );
  };

  const enviarPedido = () => {
    if (cart.length === 0) {
      alert("Carrinho vazio!");
      return;
    }

    if (!nome || !endereco || !bairro || !cidade) {
      alert("Preencha todos os campos do endereço.");
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
    )}\n\n*Cliente:* ${nome}\n*Endereço:* ${endereco}\n*Bairro:* ${bairro}\n*Cidade:* ${cidade}`;

    const numeroWhatsApp = "5588981252883"; // coloque o número com DDD + 55 no começo
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
      mensagem
    )}`;

    window.open(url, "_blank");
    setCart([]);
    setNome("");
    setEndereco("");
    setBairro("");
    setCidade("");
    setEnderecoOpen(false);
  };

  return (
    <div className="  flex justify-center items-center p-4 h-screen  ">
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
                className="bg-white p-6 rounded-lg shadow-xl w-[100%] max-w-[800px] h-screen max-h-[600px]"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                {selectedFood && (
                  <>
                    <img
                      src={selectedFood.imagen}
                      alt={selectedFood.produto}
                      className="w-[150px] h-[150px] object-contain mb-4"
                    />
                    <h2 className="text-2xl font-bold mb-2">
                      {selectedFood.produto}
                    </h2>
                    <p className="text-gray-600 mb-2">
                      {selectedFood.description}
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      R$ {selectedFood.preco.toFixed(2)}
                    </p>
                  </>
                )}

                <button onClick={() => setIsOpen(false)}>Fechar</button>
                <button
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  onClick={adicionarAoCarrinho}
                >
                  Adicionar ao Carrinho
                </button>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <ul className="w-[100%] max-w-[800px] flex flex-col gap-2.5  ">
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
        className={`fixed p-3 flex justify-center items-center bg-[#000000c4]  shadow-lg transition-all duration-500 ease-in-out transform  ${
          cartOpen
            ? "opacity-100 scale-100 h-screen w-screen"
            : "opacity-0 scale-95 h-screen w-screen pointer-events-none"
        }`}
      >
        <div className="bg-gray-100 w-[100%] max-w-[500px] rounded-xl p-4">
          <button
            onClick={() => setCartOpen(false)}
            className="mb-2 float-right"
          >
            ❌
          </button>

          <h2 className="text-xl font-bold mb-2">🛒 Carrinho</h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">Nenhum item no carrinho.</p>
          ) : (
            <ul className="space-y-2">
              {cart.map((item) => (
                <li key={item.id} className="flex justify-between items-center">
                  <span>{item.produto}</span>
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
            <div className="text-right font-bold text-lg mt-4 border-t-2">
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
            >
              Avançar
            </button>
          )}
        </div>
      </div>

      <div
        className={`fixed p-4 bg-gray-100 rounded shadow-lg transition-all duration-500 ease-in-out transform  ${
          enderecoOpen
            ? "opacity-100 scale-100 max-h-[500px]"
            : "opacity-0 scale-95 max-h-0 pointer-events-none"
        }`}
      >
        <button
          onClick={() => {
            setEnderecoOpen(false);
          }}
        >
          ❌
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
          placeholder="Rua, número, complemento..."
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
          placeholder="Cidade"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <button
          onClick={enviarPedido}
          className="w-full mt-4 px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Enviar Pedido via WhatsApp
        </button>
      </div>
      <button onClick={abrirCart}>
        Carrinho <span>{`${cart.length > 0 ? cart.length : ""}`}</span>
      </button>
    </div>
  );
}
export default Foods;
