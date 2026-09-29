import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

import "../styles/Home.css";


function Home() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar/>
      <div style={{ padding: "40px", flex: 1 }}>
        <h1>Bem-Vindo ao UniFit</h1>
        <p>Essa é a área logada</p>
        <p>Em breve: catálogo de exercícios, fichas, etc.</p>

      <div className="h1-home">Meu fi vai programar agora vai???</div>
      </div>
      <Footer/>
    </div>
  );
}
export default Home;