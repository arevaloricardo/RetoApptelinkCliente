import React from 'react';
import { useState, useEffect } from 'react';
import API_BASE_URL from '../hooks/APIConfig';
import Search from '../components/Search';

const SelectCustomer = ({ showModal, setShowModal, setSendData, setCustomer } ) => {

    const [customers, setCustomers] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [filterByProperty, setFilterByProperty] = useState("");
    const [filterValue, setFilterValue] = useState("");

    const handleSetCustomer = (customer) => {
        setCustomer(customer);
        setShowModal(false);
    }
    
    useEffect(() => {
        fetch(
          `${API_BASE_URL}/api/Customer?pageIndex=${pageIndex}&pageSize=8&filterByProperty=${filterByProperty}&filterValue=${filterValue}&orderByProperty=Date_Created_Customer&sortOrder=desc`
        )
          .then((response) => response.json())
          .then((data) => {
            setCustomers(data.data);
            setHasNextPage(data.hasNextPage);
            setSendData(0);
          });
    }, [pageIndex, filterByProperty, filterValue, setSendData]);
    

    if(showModal === false) return null;

    return (
      <div onClick={() => setShowModal(false)} className="modal__container">
        <div
          onClick={(e) => e.stopPropagation()}
          className="modal modal__content-select__customer"
        >
          <button className="modal__close" onClick={() => setShowModal(false)}>
            X
          </button>
          <h2>Seleccionar Cliente</h2>

          <div className="modal__body">
            <Search
              options={{
                rucDni_Customer: "RUC/DNI",
                name_Customer: "Nombre",
                alias_Customer: "Alias",
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
                    <th>Razon Social</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Dirección</th>
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
                        <div className="table__buttons">
                          <button
                            className="button button__green"
                            onClick={() =>
                              handleSetCustomer(customer)
                            }
                          >
                            Seleccionar
                          </button>
                          
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                        </table>
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
                    
          </div>
        </div>
      </div>
    );
}
 
export default SelectCustomer;