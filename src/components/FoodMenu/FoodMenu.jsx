
import Foods from "../Foods/Foods";
import coscuz from "../../assets/img/coscuz.png";
import caldoCarne from "../../assets/img/caldoCarne.png";
import caldoKenga from "../../assets/img/caldoKenga.png";
import pastel from "../../assets/img/pastel.png";
import macarrao from "../../assets/img/macarrao.png";
import batata from "../../assets/img/batata.png";
import strognoff from "../../assets/img/strognoff.png";
import acai from "../../assets/img/acai.png"

function FoodMenu() {
  const food = [
    {
      id: 1,
      imagen: coscuz,
      produto: "Cuscuz recheado",
      description:
        "Carne de sol ou frango, acompanha queijo, requeijão e cheddar",
      preco: 10,
    },
    {
      id: 2,
      imagen: caldoCarne,
      produto: "Sopa de carne - 500ml",
      description: "Acompanha torradinhas temperadas",
      preco: 8,
    },
    {
      id: 3,
      imagen: caldoKenga,
      produto: "Caldo de kenga - 500ml",
      description: "Acompanha torradinhas temperadas",
      preco: 8,
    },
    {
      id: 4,
      imagen: macarrao,
      produto: "Macarrão no pote - 500g",
      description: "Molho bolonhesa",
      preco: 12,
    },
    {
      id: 5,
      imagen: pastel,
      produto: "Pastel de feira",
      description: "Misto, queijo ou pizza",
      preco: 5,
    },
    {
      id: 6,
      imagen: batata,
      produto: "Batata frita",
      description: "200 gramas",
      preco: 8,
    },
    {
      id: 7,
      imagen: strognoff,
      produto: "Strogonoff de frango - 400g",
      description: "Acompanha arroz e batata palha",
      preco: 12,
    },
     {
      id: 1,
      imagen: acai,
      produto: "Açaí no copo 300g",
      description: "Acompanha leite ninho, leite moça e morango",
      preco: 13,
    },
  ];

  

  return <Foods food={food} />;
}
export default FoodMenu;
