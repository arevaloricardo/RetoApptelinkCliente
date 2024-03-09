import { useState } from "react";
import { Link } from "react-router-dom";
import NavMenu from "../components/NavMenu";
import API_BASE_URL from "../hooks/APIConfig";
import { useEffect } from "react";
import { ProductCreate } from "../components/ModalProduct";
import { CustomerCreate } from "../components/ModalCustomer";
import SelectCustomer from "../components/SelectCustomer";
import { useNavigate } from "react-router-dom";

const CreateInvoice = () => {
  const [searchProductBy, setSearchProductBy] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [products, setProducts] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [sendData, setSendData] = useState(0);
    const [showCreateProductModal, setShowCreateProductModal] = useState(false);
    const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);
    const [showSelectCustomerModal, setShowSelectCustomerModal] = useState(false);
    const [igv, setIgv] = useState(18);
    const [igvTotal, setIgvTotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [subtotal, setSubtotal] = useState(0);


   const navigate = useNavigate();

   const handleSendInvoiceData = () => {
     fetch(`${API_BASE_URL}/api/Invoice`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         total_Invoice: total,
         id_Customer_Invoice: selectedCustomer.id_Customer,
       }),
     })
       .then((response) => response.json())
       .then((data) => {
         navigate("/facturas");
       })
       .catch((error) => {
         console.error("Error:", error);
       });
   };

    useEffect(() => {
      let totalSubtotal = 0;
      selectedProduct.forEach((product) => {
        totalSubtotal += product.subtotal;
      });

      setSubtotal(Math.floor(totalSubtotal * 100) / 100);

      const igvValue = totalSubtotal * (igv / 100);
      setIgvTotal(Math.floor(igvValue * 100) / 100);

      const totalValue = totalSubtotal + igvValue;
      setTotal(Math.floor(totalValue * 100) / 100);
    }, [selectedProduct, igv]);

const handleQuantityChange = (index, event) => {
  // Crea una copia del estado actual
  let newSelectedProduct = [...selectedProduct];

  // Actualiza la cantidad del producto en el índice especificado
  newSelectedProduct[index].quantity = event.target.value;

  // Calcula y almacena el subtotal para este producto
  newSelectedProduct[index].subtotal =
    event.target.value * newSelectedProduct[index].price_Product;

  // Actualiza el estado
  setSelectedProduct(newSelectedProduct);

  // Llama a handleSetSubtotal después de actualizar el estado
  handleSetSubtotal();
};

const removeProduct = (index) => {
  // Crea una copia del estado actual
  let newSelectedProduct = [...selectedProduct];

  // Quita el producto en el índice especificado
  if (index > -1) {
    newSelectedProduct.splice(index, 1);
  }

  // Actualiza el estado
  setSelectedProduct(newSelectedProduct);

  // Llama a handleSetSubtotal después de actualizar el estado
  handleSetSubtotal();
};


  useEffect(() => {
    fetch(
      `${API_BASE_URL}/api/Product?pageIndex=${pageIndex}&pageSize=10&filterByProperty=${searchProductBy}&filterValue=${searchValue}&orderByProperty=Date_Created_Product&sortOrder=desc`
    )
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.data);
        setHasNextPage(data.hasNextPage);
        console.log(data);
      });
  }, [
    pageIndex,
    searchProductBy,
    searchValue,
    sendData,
    showCreateProductModal,
  ]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Products`);
      const data = await response.json();

      console.log(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="app__container">
      <NavMenu />

      <div className="page__container">
        <div className="page__header">
          <Link className="button button__red" to="/facturas">
            Volver
          </Link>

          <h1 className="header__create-invoice">Crear Factura</h1>
        </div>

        <div className="create-invoice__container">
          <div className="search__products">
            <div className="search__container">
              <h3 className="search__tittle">Buscar producto</h3>
              <label htmlFor="filterByProperty">Buscar por:</label>
              <select
                value={searchProductBy}
                onChange={(e) => setSearchProductBy(e.target.value)}
              >
                <option disabled value="">
                  - Seleccionar -
                </option>
                <option value="name_Product">Nombre</option>
                <option value="code_Product">Código</option>
              </select>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            <div className="products__container">
              <div className="products__table__container">
                <table>
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Nombre</th>
                      <th>Stock</th>
                      <th>Precio</th>
                      <th>Acciones</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id_Product}>
                        <td className="invoice__table__code">
                          #{product.code_Product}
                        </td>
                        <td>{product.name_Product}</td>
                        <td>
                          <p className="product__stock">
                            {product.stock_Product}
                          </p>
                        </td>
                        <td>$ {product.price_Product}</td>
                        <td>
                          <button
                            onClick={() =>
                              setSelectedProduct((prevSelectedProducts) => [
                                ...prevSelectedProducts,
                                product,
                              ])
                            }
                            className="button button__green"
                          >
                            Agregar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {products.length === 0 ? (
                <div className="no__products">
                  <p>No se encontró el producto</p>
                  <button
                    onClick={() => setShowCreateProductModal(true)}
                    className="button button__add"
                  >
                    Agregar Un Producto
                  </button>
                </div>
              ) : (
                <div className="pagination">
                  <button
                    onClick={() => setPageIndex(pageIndex - 1)}
                    disabled={pageIndex === 1}
                    className={
                      pageIndex === 1
                        ? "button-page__disable"
                        : "button-page__enable"
                    }
                  >
                    <i class="bx bx-left-arrow-alt"></i>
                    Anterior
                  </button>

                  <button
                    onClick={() => setPageIndex(pageIndex + 1)}
                    disabled={!hasNextPage}
                    className={
                      !hasNextPage
                        ? "button-page__disable"
                        : "button-page__enable"
                    }
                  >
                    Siguiente
                    <i class="bx bx-right-arrow-alt"></i>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="invoice__container">
            <div className="invoice__header">
              <h2>Factura</h2>
            </div>

            <div className="invoice__body">
              <div className="invoice__products__container">
                <div className="invoice__products__table__container">
                  <div className="invoice__customer__container">
                    {!selectedCustomer ? (
                      <>
                        <button
                          onClick={() => setShowSelectCustomerModal(true)}
                          className="button button__add"
                        >
                          Seleccionar Cliente
                        </button>
                        <button
                          onClick={() => setShowCreateCustomerModal(true)}
                          className="button button__primary"
                        >
                          Nuevo Cliente
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="customer__data">
                          <h3>Cliente:</h3>
                          <p>
                            <b>Razon Social:</b>{" "}
                            {selectedCustomer.name_Customer}
                          </p>
                          <p>
                            <b>RUC/DNI: </b>
                            {selectedCustomer.rucDni_Customer}
                          </p>
                          <p>
                            <b>Dirección: </b>
                            {selectedCustomer.address_Customer}
                          </p>
                          <p>
                            <b>Correo: </b>
                            {selectedCustomer.email_Customer}
                          </p>
                        </div>

                        <button
                          onClick={() => setSelectedCustomer(null)}
                          className="button button__red"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>

                  <h3 className="invoice__products__tittle">Productos:</h3>
                  <table>
                    <thead>
                      <tr>
                        <th className="invoice__table__code__tittle">Código</th>
                        <th>Nombre</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProduct.map((product, index) => (
                        <tr key={product.id_Product}>
                          <td className="invoice__table__code">
                            #{product.code_Product}
                          </td>
                          <td>{product.name_Product}</td>
                          <td className="invoice__quantity">
                            <input
                              type="number"
                              value={product.quantity}
                              onChange={(event) =>
                                handleQuantityChange(index, event)
                              }
                            />
                          </td>
                          <td>$ {product.price_Product}</td>
                          <td>
                            $ {Math.floor((product.subtotal || 0) * 100) / 100}
                          </td>
                          <td>
                            <button
                              onClick={() => removeProduct(index)}
                              className="button button__red"
                            >
                              Quitar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="invoice__footer">
                <div className="invoice__subtotal">
                  <h3>Subtotal:</h3>
                  <p>$ {subtotal}</p>
                </div>

                <div className="invoice__igv">
                  <h3>IGV: {`(${igv}%)`}</h3>
                  <p>$ {igvTotal}</p>
                </div>

                <div className="invoice__total">
                  <h3>Total:</h3>
                  <p>$ {total}</p>
                </div>
                <button
                  className="button button__white"
                  onClick={() => handleSendInvoiceData()}
                >
                  Finalizar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductCreate
        showModal={showCreateProductModal}
        setShowModal={setShowCreateProductModal}
        setSendData={setSendData}
      />

      <CustomerCreate
        showModal={showCreateCustomerModal}
        setShowModal={setShowCreateCustomerModal}
        setSendData={setSendData}
        setCustomer={setSelectedCustomer}
      />

      <SelectCustomer
        showModal={showSelectCustomerModal}
        setShowModal={setShowSelectCustomerModal}
        setCustomer={setSelectedCustomer}
        setSendData={setSendData}
      />
    </div>
  );
};

export default CreateInvoice;
