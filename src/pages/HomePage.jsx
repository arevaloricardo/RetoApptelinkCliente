import NavMenu from "../components/NavMenu";
import { Link } from "react-router-dom";
import API_BASE_URL  from "../hooks/APIConfig";
import { useEffect, useState } from "react";
import { CustomerCreate } from "../components/ModalCustomer";
import { ProductCreate } from "../components/ModalProduct";

const HomePage = () => {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
  const [sendData, setSendData] = useState(0);


  useEffect(() => {
    fetch(`${API_BASE_URL}/api/Customer?pageIndex=1&pageSize=5&filterByProperty=&filterValue=&orderByProperty=Date_Created_Customer&sortOrder=desc`)
      .then((response) => response.json())
      .then((data) => {
        setClients(data.data);
      });
  }, []);
  
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/Product?pageIndex=1&pageSize=5&filterByProperty=&filterValue=&orderByProperty=Date_Created_Product&sortOrder=desc`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.data);
      });
  }, []);
  
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/Invoice?pageIndex=1&pageSize=5&filterByProperty=&filterValue=&orderByProperty=Id_Invoice&sortOrder=desc`)
      .then((response) => response.json())
      .then((data) => {
        setInvoices(data.data);
      });
  }, []);


  return (
    <>
      <div className="app__container">
        <NavMenu />
        <div className="page__container">
          <div className="page__header">
            <h1>Inicio</h1>
          </div>
          <div className="home__container">
            <div className="home__card">
              <div className="home__card__header">

              <h2>Clientes Recientes</h2>
              <button onClick={()=> setShowCreateCustomerModal(true)} className="button button__add">Crear</button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>RUC/DNI</th>
                    <th>Correo</th>
                    <th>Dirección</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id_Customer}>
                      <td>{client.name_Customer}</td>
                      <td>{client.rucDni_Customer}</td>
                      <td>{client.email_Customer}</td>
                      <td>{client.address_Customer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="home__card">
              <div className="home__card__header">
              <h2>Productos Recientes</h2>
              <button onClick={()=> setShowCreateProductModal(true)} className="button button__add">Crear</button>

              </div>
              <table>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id_Product}>
                      <td>#{product.code_Product}</td>
                      <td>{product.name_Product}</td>
                      <td>$ {product.price_Product}</td>
                      <td>{product.stock_Product}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="home__card">
              <div className="home__card__header">
              <h2>Facturas Recientes</h2>
              <Link className="button button__green" to="/facturas/crear">Crear</Link>

              </div>
              <table>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Cliente</th>
                    <th>DNI/RUC</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id_Invoice}>
                      <td>#{invoice.id_Invoice}</td>
                      <td>{invoice.customer.name_Customer}</td>
                      <td>{invoice.customer.rucDni_Customer}</td>
                      <td>$ {invoice.total_Invoice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <CustomerCreate
          showModal={showCreateCustomerModal}
          setShowModal={setShowCreateCustomerModal}
          setSendData={setSendData}
        />

        <ProductCreate
          showModal={showCreateProductModal}
          setShowModal={setShowCreateProductModal}
          setSendData={setSendData}
        />
      </div>
    </>
  );
};

export default HomePage;
