import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

function Home() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar/>
      <div style={{ padding: "40px", flex: 1 }}>
        <h1>Bem-Vindo ao UniFit</h1>
        <p>Essa é a área logada</p>
        <p>Em breve: catálogo de exercícios, fichas, etc.</p>
      </div>
      <Footer/>
    </div>
  );
}
export default Home;