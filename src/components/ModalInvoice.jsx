import { useState, useEffect } from "react";
import API_BASE_URL from "../hooks/APIConfig";
import Alerta from "./Alerta";

export const InvoiceView = ({ id, showModal, setShowModal }) => {
  const [data, setData] = useState(null);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFetchData = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Invoice/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }

      setData(responseData);
    } catch (error) {
      setData(error.message);
    }
  };

  useEffect(() => {
    if (id && showModal) {
      handleFetchData(id);
    }
  }, [id, showModal]);

  if (showModal) {
    return (
      <div onClick={() => setShowModal(false)} className="modal__container">
        <div
          onClick={(e) => e.stopPropagation()}
          className="modal modal__content-view__invoice"
        >
          <button onClick={() => handleCloseModal()} className="modal__close">
            x
          </button>
          {data ? (
            <div className="modal__data">
              <h2 className="modal__tittle">{data.name_Invoice}</h2>
              <p>
                Código: <span># {data.code_Invoice}</span>
              </p>
              <p>
                Precio: <span>$ {data.price_Invoice}</span>
              </p>
              <p>
                En Stock:{" "}
                <span className="modal__stock">{data.stock_Invoice}</span>
              </p>
              <p>
                Estado:{" "}
                <span className="modal__status">
                  {data.is_Active_Invoice == "1" ? "Activo" : "Inactivo"}
                </span>
              </p>
            </div>
          ) : (
            <p>Cargando...</p>
          )}
        </div>
      </div>
    );
  }
};

export const InvoiceCreate = ({ showModal, setShowModal, setSendData }) => {
  const [date, setDate] = useState();
  const [code, setCode] = useState();
  const [formData, setFormData] = useState({
    code_Invoice: 0,
    name_Invoice: "",
    price_Invoice: "",
    stock_Invoice: "",
    is_Active_Invoice: 1,
    date_Created_Invoice: date,
  });

  const generateUniqueCode = async () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let generatedCode = "";
    for (let i = 0; i < 15; i++) {
      generatedCode += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/api/Invoice?filterByProperty=code_Invoice&filterValue=${generatedCode}&pageIndex=1&pageSize=1`
    );
    const invoice = await response.json();

    if (invoice.data.length > 0) {
      generateUniqueCode();
    } else {
      setCode(generatedCode);
    }
  };

  const handleSubmitDate = () => {
    const newDate = new Date().toISOString();
    setDate(newDate);
    generateUniqueCode();
    setFormData({
      ...formData,
      code_Invoice: code,
      date_Created_Invoice: newDate,
    });
  };

  const [errors, setErrors] = useState({});
  const [alerta, setAlerta] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const field = id + "_Invoice";
    setFormData({ ...formData, [field]: value });

    if (!value) {
      setErrors({ ...errors, [id]: "input__error" });
    } else if (id === "code" && value.length > 15) {
      setErrors({ ...errors, [id]: "input__error" });
      setAlerta("El código no debe contener más de 15 caracteres.");
    } else {
      setErrors({ ...errors, [id]: "" });
      setAlerta(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = Object.keys(formData).reduce((acc, curr) => {
      if (!formData[curr]) {
        const field = curr.replace("_Invoice", "");
        acc[field] = "input__error";
        setAlerta("Campos faltantes");
      }
      return acc;
    }, {});
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/Invoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error(response.statusText);
      const data = await response.json();
      console.log(data);
      setShowModal(false);
      setSendData(1);
    } catch (error) {
      console.error(error);
    }
  };

  if (showModal) {
    return (
      <div onClick={() => setShowModal(false)} className="modal__container">
        <div
          onClick={(e) => e.stopPropagation()}
          className="modal modal__content-create__invoice"
        >
          <button onClick={() => setShowModal(false)} className="modal__close">
            X
          </button>
          <h2 className="modal__tittle">Agregar Invoice</h2>
          <form className="modal__form-create" onSubmit={handleSubmit}>
            <div className="modal__form-create__input">
              <label htmlFor="name">Nombre del Invoice:</label>
              <input
                type="text"
                id="name"
                onChange={handleChange}
                className={errors.name}
              />
            </div>
            <div className="modal__form-create__input">
              <label htmlFor="price">Precio del Invoice:</label>
              <input
                type="text"
                id="price"
                onChange={handleChange}
                pattern="^\d*(\.\d{0,2})?$"
                className={errors.price}
              />
            </div>
            <div className="modal__form-create__input">
              <label htmlFor="stock">Cantidad en stock:</label>
              <input
                type="number"
                id="stock"
                onChange={handleChange}
                className={errors.stock}
              />
            </div>

            <div className="button__container-center">
              <button
                className="button button__modal__create"
                onClick={() => handleSubmitDate()}
                type="submit"
              >
                Crear
              </button>
            </div>
          </form>
          {alerta && <Alerta tipo="error" texto={alerta} />}
        </div>
      </div>
    );
  }
};

export const InvoiceUpdate = ({ id, showModal, setShowModal, setSendData }) => {
  const [formData, setFormData] = useState({
    name_Invoice: "",
    price_Invoice: "",
    stock_Invoice: "",
    is_Active_Invoice: 1,
    date_Created_Invoice: new Date().toISOString(),
  });

  const [errors, setErrors] = useState({});
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`${API_BASE_URL}/api/Invoice/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setFormData(data);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const field = id + "_Invoice";
    setFormData({ ...formData, [field]: value });

    if (!value) {
      setErrors({ ...errors, [id]: "input__error" });
    } else if (id === "code" && value.length > 15) {
      setErrors({ ...errors, [id]: "input__error" });
      setAlerta("El code no puede ser mayor que 15 caracteres");
    } else {
      setErrors({ ...errors, [id]: "" });
      setAlerta(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = Object.keys(formData).reduce((acc, curr) => {
      if (!formData[curr]) {
        const field = curr.replace("_Invoice", "");
        acc[field] = "input__error";
        setAlerta(`Campos faltantes`);
      }
      return acc;
    }, {});
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/Invoice/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error(response.statusText);
      const text = await response.text();
      if (text) {
        const data = JSON.parse(text);
        console.log(data);
      }
      setShowModal(false);
      setSendData(1);
    } catch (error) {
      console.error(error);
    }
  };

  if (showModal) {
    return (
      <div onClick={() => setShowModal(false)} className="modal__container">
        <div
          onClick={(e) => e.stopPropagation()}
          className="modal modal__content-update__invoice"
        >
          <button onClick={() => setShowModal(false)} className="modal__close">
            X
          </button>
          <h2 className="modal__tittle">Editar Invoice</h2>
          <form onSubmit={handleSubmit}>
            <div className="modal__form-update__input">
              <label htmlFor="code">Código:</label>
              <input
                type="text"
                id="code"
                disabled
                value={"# " + formData.code_Invoice}
                className={errors.code}
              />
            </div>
            <div className="modal__form-update__input">
              <label htmlFor="name">Nombre del Invoice:</label>
              <input
                type="text"
                id="name"
                onChange={handleChange}
                value={formData.name_Invoice}
                className={errors.name}
              />
            </div>
            <div className="modal__form-update__input">
              <label htmlFor="price">Precio del Invoice:</label>
              <input
                type="text"
                id="price"
                onChange={handleChange}
                value={formData.price_Invoice}
                className={errors.price}
              />
            </div>
            <div className="modal__form-update__input">
              <label htmlFor="stock">Cantidad en stock:</label>
              <input
                type="text"
                id="stock"
                onChange={handleChange}
                value={formData.stock_Invoice}
                className={errors.stock}
              />
            </div>
            <div className="modal__form-update__input">
              <label htmlFor="is_Active">Estado del Invoice:</label>
              <select
                id="is_Active"
                onChange={handleChange}
                value={formData.is_Active_Invoice}
                className={errors.is_Active}
              >
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
              </select>
            </div>
            <div className="button__container-center">
              <button className="button button__green" type="submit">
                Actualizar
              </button>
            </div>
          </form>
          {alerta && <Alerta tipo="error" texto={alerta} />}
        </div>
      </div>
    );
  }
};

export const InvoiceDelete = ({ id, showModal, setShowModal, setSendData }) => {
  const [invoiceName, setInvoiceName] = useState("");

  useEffect(() => {
    if (id) {
      fetch(`${API_BASE_URL}/api/Invoice/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setInvoiceName(data.name_Invoice);
        });
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Invoice/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(response.statusText);
      setShowModal(false);
      setSendData(1);
    } catch (error) {
      console.error(error);
    }
  };

  if (showModal) {
    return (
      <div onClick={() => setShowModal(false)} className="modal__container">
        <div
          onClick={(e) => e.stopPropagation()}
          className="modal modal__content-delete__invoice"
        >
          <h2 className="modal__delete__tittle">Eliminar Invoice</h2>
          <p>
            ¿Seguro que quieres eliminar <span>{invoiceName}</span>?
          </p>
          <div className="button__container-center">
            <button className="button button__green" onClick={handleDelete}>
              Sí
            </button>
            <button
              className="button button__red"
              onClick={() => setShowModal(false)}
            >
              No
            </button>
          </div>
        </div>
      </div>
    );
  }
};
