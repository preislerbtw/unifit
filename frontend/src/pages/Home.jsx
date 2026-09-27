import Navbar from "../components/NavBar";

function Home() {
  return (
    <div>
      <Navbar/>
      <div style={{ padding: "40px" }}>
        <h1>Bem-Vindo ao UniFit</h1>
        <p>Essa é a área logada</p>
        <p>Em breve: catálogo de exercícios, fichas, etc.</p>
      </div>
    </div>
  );
}
export default Home;