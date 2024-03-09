import NavMenu from "../components/NavMenu";
import { useEffect, useState } from "react";
import API_BASE_URL from "../hooks/APIConfig";
import Search from "../components/Search";
import {
  ProductView,
  ProductCreate,
  ProductUpdate,
  ProductDelete,
} from "../components/ModalProduct";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [filterByProperty, setFilterByProperty] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [productId, setProductId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sendData, setSendData] = useState(0);


  useEffect(() => {
    fetch(
      `${API_BASE_URL}/api/Product?pageIndex=${pageIndex}&pageSize=10&filterByProperty=${filterByProperty}&filterValue=${filterValue}&orderByProperty=Date_Created_Product&sortOrder=desc`
    )
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.data);
        setHasNextPage(data.hasNextPage);
        setSendData(0);
        console.log(data);
      });
  }, [pageIndex, filterByProperty, filterValue, sendData]);

  const handleViewProduct = (id) => {
    setProductId(id);
    setShowViewModal(true);
  };

  const handleUpdateProduct = (id) => {
    setProductId(id);
    setShowUpdateModal(true);
  };

  const handleDeleteProduct = (id) => {
    setProductId(id); 
    setShowDeleteModal(true);
  };

  return (
    <div className="app__container">
      <NavMenu />

      <div className="page__container">
        <div className="page__header">
          <h1>Productos</h1>
          <button
            className="button button__add"
            onClick={() => setShowCreateModal(true)}
          >
            + Agregar Producto
          </button>
        </div>

        <Search
          options={{
            code_Product: "Código",
            name_Product: "Nombre",
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
                <th>Código</th>
                <th>Nombre del Producto</th>
                <th>Precio</th>
                <th>En Stock</th>
                <th>Estado</th>
                <th>
                  <p className="center">Acciones</p>
                </th>
              </tr>
            </thead>
            <tbody className="table__body">
              {products.map((product) => (
                <tr className="table__row" key={product.id_Product}>
                  <td># {product.code_Product}</td>
                  <td>{product.name_Product}</td>
                  <td>$ {product.price_Product}</td>
                  <td className="table__stock__container">
                    <p className="table__stock">{product.stock_Product} </p>
                  </td>
                  <td>
                    <p
                      className={
                        product.is_Active_Product == "1"
                          ? "table__active"
                          : "table__inactive"
                      }
                    >
                      {product.is_Active_Product == "1" ? "Activo" : "Inactivo"}
                    </p>
                  </td>
                  <td>
                    <div className="table__buttons">
                      <button
                        className="button__view"
                        onClick={() => handleViewProduct(product.id_Product)}
                      >
                        Ver
                      </button>
                      <button
                        className="button__edit"
                        onClick={() => handleUpdateProduct(product.id_Product)}
                      >
                        Editar
                      </button>
                      <button
                        className="button__delete"
                        onClick={() => handleDeleteProduct(product.id_Product)}
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

      <ProductView
        id={productId}
        showModal={showViewModal}
        setShowModal={setShowViewModal}
      />

      <ProductCreate
        showModal={showCreateModal}
        setShowModal={setShowCreateModal}
        setSendData={setSendData}
      />

      <ProductUpdate
        id={productId}
        showModal={showUpdateModal}
        setShowModal={setShowUpdateModal}
        setSendData={setSendData}
      />

      <ProductDelete
        id={productId}
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        setSendData={setSendData}
      />
    </div>
  );
};

export default ProductsPage;
