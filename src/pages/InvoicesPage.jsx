import NavMenu from "../components/NavMenu";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../hooks/APIConfig";
import {
  InvoiceDelete
} from "../components/ModalInvoice";

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [filterByProperty, setFilterByProperty] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [invoiceId, setInvoiceId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sendData, setSendData] = useState(0);
  

  useEffect(() => {
    fetch(
      `${API_BASE_URL}/api/Invoice?pageIndex=${pageIndex}&pageSize=10&filterByProperty=${filterByProperty}&filterValue=${filterValue}&orderByProperty=Id_Invoice&sortOrder=desc`
    )
      .then((response) => response.json())
      .then((data) => {
        setInvoices(data.data);
        setHasNextPage(data.hasNextPage);
        setSendData(0);
      });
  }, [pageIndex, filterByProperty, filterValue, sendData]);

  const handleViewInvoice = (id) => {
    setInvoiceId(id);
    setShowViewModal(true);
  };

  const handleDeleteInvoice = (id) => {
    setInvoiceId(id);
    setShowDeleteModal(true);
  };

  return (
    <div className="app__container">
      <NavMenu />

      <div className="page__container">
        <div className="page__header">
          <h1>Facturas</h1>
          <Link className="button button__green" to="/facturas/crear">
            {" "}
            + Crear Factura
          </Link>
        </div>

        <div className="search__container">
          <h3 className="search__tittle">Filtro</h3>
          <label htmlFor="filterByProperty">Buscar por:</label>
          <select
            value={filterByProperty}
            onChange={(e) => setFilterByProperty(e.target.value)}
          >
            <option disabled value="">
              - Seleccionar -
            </option>
            <option value="Id_Invoice">ID Factura</option>
            <option value="customer.rucDni_Customer">Ruc/Dni</option>
            <option value="customer.name_Customer">Nombre Cliente</option>
            <option value="Id_Invoice">ID Factura</option>
          </select>
          <input
            type="text"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        </div>

        <div className="table__container">
          <table className="table">
            <thead className="table__head">
              <tr className="table__row">
                <th># Id</th>
                <th>Ruc/Dni Cliente</th>
                <th>Nombre Cliente</th>
                <th>Total</th>
                <th>
                  <p className="center">Acciones</p>
                </th>
              </tr>
            </thead>
            <tbody className="table__body">
              {invoices.map((invoice) => (
                <tr className="table__row" key={invoice.id_Invoice}>
                  <td># {invoice.id_Invoice}</td>
                  <td>{invoice.customer.rucDni_Customer}</td>
                  <td>{invoice.customer.name_Customer}</td>
                  <td>$ {invoice.total_Invoice}</td>
                  <td>
                    <div className="table__buttons">
          
                      <button
                        className="button__delete"
                        onClick={() => handleDeleteInvoice(invoice.id_Invoice)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            onClick={() => setPageIndex(pageIndex - 1)}
            disabled={pageIndex === 1}
            className={
              pageIndex === 1 ? "button-page__disable" : "button-page__enable"
            }
          >
            <i class="bx bx-left-arrow-alt"></i>
            Anterior
          </button>
          <button
            onClick={() => setPageIndex(pageIndex + 1)}
            disabled={!hasNextPage}
            className={
              !hasNextPage ? "button-page__disable" : "button-page__enable"
            }
          >
            Siguiente
            <i class="bx bx-right-arrow-alt"></i>
          </button>
        </div>
      </div>

      <InvoiceDelete
        id={invoiceId}
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        setSendData={setSendData}
      />
    </div>
  );
};

export default InvoicesPage;
