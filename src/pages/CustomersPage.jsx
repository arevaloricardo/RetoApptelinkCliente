import NavMenu from "../components/NavMenu";
import { useEffect, useState } from "react";
import API_BASE_URL from "../hooks/APIConfig";
import Search from "../components/Search";
import {
  CustomerView,
  CustomerCreate,
  CustomerUpdate,
  CustomerDelete,
} from "../components/ModalCustomer";

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [filterByProperty, setFilterByProperty] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sendData, setSendData] = useState(0);

  useEffect(() => {
    fetch(
      `${API_BASE_URL}/api/Customer?pageIndex=${pageIndex}&pageSize=4&filterByProperty=${filterByProperty}&filterValue=${filterValue}&orderByProperty=Date_Created_Customer&sortOrder=desc`
    )
      .then((response) => response.json())
      .then((data) => {
        setCustomers(data.data);
        setHasNextPage(data.hasNextPage);
        setSendData(0);
      });
  }, [pageIndex, filterByProperty, filterValue, sendData]);

  const handleViewCustomer = (id) => {
    setCustomerId(id);
    setShowViewModal(true);
  };

  const handleUpdateCustomer = (id) => {
    setCustomerId(id);
    setShowUpdateModal(true);
  };

  const handleDeleteCustomer = (id) => {
    setCustomerId(id);
    setShowDeleteModal(true);
  };

  return (
    <div className="app__container">
      <NavMenu />

      <div className="page__container">
        <div className="page__header">
          <h1>Clientes</h1>
          <button
            className="button button__add"
            onClick={() => setShowCreateModal(true)}
          >
            + Agregar Cliente
          </button>
        </div>

        <Search
          options={{
            rucDni_Customer: "RUC",
            name_Customer: "Razón Social",
            alias_Customer: "Nombre",  
            email_Customer: "Correo",
            address_Customer: "Dirección",
          }}
          filterByProperty={filterByProperty}
          setFilterByProperty={setFilterByProperty}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
        />

        <div className="table__container">
          <table className="table">
            <thead className="table__head">
              <tr className="table__row">
                <th>RUC/DNI</th>
                <th>Razón Social</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Dirección</th>
                <th>Estado</th>
                <th>
                  <p className="center">Acciones</p>
                </th>
              </tr>
            </thead>
            <tbody className="table__body">
              {customers.map((customer) => (
                <tr className="table__row" key={customer.id_Customer}>
                  <td>{customer.rucDni_Customer}</td>
                  <td>{customer.name_Customer}</td>
                  <td>{customer.alias_Customer}</td>
                  <td>{customer.email_Customer}</td>
                  <td>{customer.address_Customer}</td>
                  <td>
                    <p
                      className={
                        customer.is_Active_Customer == "1"
                          ? "table__active"
                          : "table__inactive"
                      }
                    >
                      {customer.is_Active_Customer == "1"
                        ? "Activo"
                        : "Inactivo"}
                    </p>
                  </td>
                  <td>
                    <div className="table__buttons">
                      <button
                        className="button__view"
                        onClick={() => handleViewCustomer(customer.id_Customer)}
                      >
                        Ver
                      </button>
                      <button
                        className="button__edit"
                        onClick={() =>
                          handleUpdateCustomer(customer.id_Customer)
                        }
                      >
                        Editar
                      </button>
                      <button
                        className="button__delete"
                        onClick={() =>
                          handleDeleteCustomer(customer.id_Customer)
                        }
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

      <CustomerView
        id={customerId}
        showModal={showViewModal}
        setShowModal={setShowViewModal}
      />

      <CustomerCreate
        showModal={showCreateModal}
        setShowModal={setShowCreateModal}
        setSendData={setSendData}
      />

      <CustomerUpdate
        id={customerId}
        showModal={showUpdateModal}
        setShowModal={setShowUpdateModal}
        setSendData={setSendData}
      />

      <CustomerDelete
        id={customerId}
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        setSendData={setSendData}
      />
    </div>
  );
};

export default CustomersPage;
