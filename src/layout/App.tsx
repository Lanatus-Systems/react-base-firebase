import { BrowserRouter } from "react-router-dom";
import Content from "./content";
import Footer from "./footer";
import Header from "./header";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Content />
      <Footer />
    </BrowserRouter>
  );
};

export default App;
