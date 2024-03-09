import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CustomersPage from "./pages/CustomersPage";
import ProductsPage from "./pages/ProductsPage";
import InvoicesPage from "./pages/InvoicesPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import CreateInvoice from "./pages/CreateInvoice";
import UserState from "./context/user/UserState";

function App() {
  return (
    <UserState>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/inicio" element={<HomePage />} />
          <Route path="/clientes" element={<CustomersPage />}/>
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/facturas" element={<InvoicesPage />} />
          <Route path="/facturas/crear" element={<CreateInvoice />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </UserState>
  );
}

export default App;
