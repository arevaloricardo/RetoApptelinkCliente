import { useState, useEffect } from "react";
import API_BASE_URL from "../hooks/APIConfig";
import Alerta from "./Alerta";

export const CustomerView = ({ id, showModal, setShowModal }) => {
  const [data, setData] = useState(null);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFetchData = async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Customer/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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
          className="modal modal__content"
        >
          <button onClick={() => handleCloseModal()} className="modal__close">
            x
          </button>
          {data ? (
            <div className="modal__data">
              <h2 className="modal__tittle">{data.name_Customer}</h2>
              <p>
                RUC/DNI: <span>{data.rucDni_Customer}</span>
              </p>
              <p>
                Alias: <span>{data.alias_Customer}</span>
              </p>
              <p>
                Correo: <span>{data.email_Customer}</span>
              </p>
              <p>
                Dirección: <span>{data.address_Customer}</span>
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

export const CustomerCreate = ({ showModal, setShowModal, setSendData, setCustomer }) => {

    const [date, setDate] = useState();
  const [formData, setFormData] = useState({
    rucDni_Customer: "",
    name_Customer: "",
    alias_Customer: "",
    email_Customer: "",
    address_Customer: "",
    is_Active_Customer: 1,
    date_Created_Customer: date
  });
    

    
    const handleSubmitDate = () => {
        const newDate = new Date().toISOString();
        setDate(newDate);
        setFormData({ ...formData, date_Created_Customer: newDate });
    };

  const [errors, setErrors] = useState({});
  const [alerta, setAlerta] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const field = id + "_Customer";
    setFormData({ ...formData, [field]: value });

    if (!value) {
      setErrors({ ...errors, [id]: "input__error" });
    } else if (id === "rucDni" && value.length > 15) {
      setErrors({ ...errors, [id]: "input__error" });
      setAlerta("El RUC/DNI no puede ser mayor que 15 caracteres");
    } else {
      setErrors({ ...errors, [id]: "" });
      setAlerta(null);
    }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = Object.keys(formData).reduce((acc, curr) => {
      if (!formData[curr]) {
        const field = curr.replace("_Customer", "");
        acc[field] = "input__error";
        setAlerta("Campos faltantes");
      }
      return acc;
    }, {});
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/Customer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
     
      const data = await response.json();
      
      if (!data.message) { 
        setShowModal(false);
        setSendData(1);
        setCustomer(data);
      } else {
        setAlerta(data.message);
      }

    } catch (error) {
      console.error(error);
    }
  };

  if (showModal) {
    return (
      <div onClick={() => setShowModal(false)} className="modal__container">
        <div
          onClick={(e) => e.stopPropagation()}
          className="modal modal__content-create"
        >
          <button onClick={() => setShowModal(false)} className="modal__close">
            X
          </button>
          <h2 className="modal__tittle">Crear Cliente</h2>
          <form className="modal__form-create" onSubmit={handleSubmit}>
            <div className="modal__form-create__input">
              <label htmlFor="rucDni">RUC/DNI:</label>
              <input
                type="text"
                id="rucDni"
                onChange={handleChange}
                className={errors.rucDni}
              />
            </div>
            <div className="modal__form-create__input">
              <label htmlFor="name">Razón Social:</label>
              <input
                type="text"
                id="name"
                onChange={handleChange}
                className={errors.name}
              />
            </div>
            <div className="modal__form-create__input">
              <label htmlFor="alias">Nombre:</label>
              <input
                type="text"
                id="alias"
                onChange={handleChange}
                className={errors.alias}
              />
            </div>
            <div className="modal__form-create__input">
              <label htmlFor="email">Correo:</label>
              <input
                type="text"
                id="email"
                onChange={handleChange}
                className={errors.email}
              />
            </div>
            <div className="modal__form-create__input">
              <label htmlFor="address">Dirección:</label>
              <input
                type="text"
                id="address"
                onChange={handleChange}
                className={errors.address}
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

export const CustomerUpdate = ({
  id,
  showModal,
  setShowModal,
  setSendData,
}) => {
  const [formData, setFormData] = useState({
    rucDni_Customer: "",
    name_Customer: "",
    alias_Customer: "",
    email_Customer: "",
    address_Customer: "",
    is_Active_Customer: 1,
    date_Created_Customer: new Date().toISOString(),
  });

  const [errors, setErrors] = useState({});
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`${API_BASE_URL}/api/Customer/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setFormData(data);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const field = id + "_Customer";
    setFormData({ ...formData, [field]: value });

    if (!value) {
      setErrors({ ...errors, [id]: "input__error" });
    } else if (id === "rucDni" && value.length > 15) {
      setErrors({ ...errors, [id]: "input__error" });
      setAlerta("El RUC/DNI no puede ser mayor que 15 caracteres");
    } else {
      setErrors({ ...errors, [id]: "" });
      setAlerta(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = Object.keys(formData).reduce((acc, curr) => {
      if (!formData[curr]) {
        const field = curr.replace("_Customer", "");
        acc[field] = "input__error";
        setAlerta(`Campos faltantes`);
      }
      return acc;
    }, {});
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/Customer/${id}`, {
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
          className="modal modal__content-update"
        >
          <button onClick={() => setShowModal(false)} className="modal__close">
            X
          </button>
          <h2 className="modal__tittle">Editar Cliente</h2>
          <form onSubmit={handleSubmit}>
            <div className="modal__form-update__input">
              <label htmlFor="rucDni">RUC/DNI:</label>
              <input
                type="text"
                id="rucDni"
                onChange={handleChange}
                value={formData.rucDni_Customer}
                className={errors.rucDni}
              />
            </div>
            <div className="modal__form-update__input">
              <label htmlFor="name">Razón Social:</label>
              <input
                type="text"
                id="name"
                onChange={handleChange}
                value={formData.name_Customer}
                className={errors.name}
              />
            </div>
            <div className="modal__form-update__input">
              <label htmlFor="alias">Nombre:</label>
              <input
                type="text"
                id="alias"
                onChange={handleChange}
                value={formData.alias_Customer}
                className={errors.alias}
              />
            </div>
            <div className="modal__form-update__input">
              <label htmlFor="email">Correo:</label>
              <input
                type="text"
                id="email"
                onChange={handleChange}
                value={formData.email_Customer}
                className={errors.email}
              />
            </div>
            <div className="modal__form-update__input">
              <label htmlFor="address">Dirección:</label>
              <input
                type="text"
                id="address"
                onChange={handleChange}
                value={formData.address_Customer}
                className={errors.address}
              />
            </div>
            <div className="modal__form-update__input">
              <label htmlFor="is_Active">Estado:</label>
              <select
                id="is_Active"
                onChange={handleChange}
                value={formData.is_Active_Customer}
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



export const CustomerDelete = ({ id, showModal, setShowModal, setSendData }) => {
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    if (id) {
      fetch(`${API_BASE_URL}/api/Customer/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setCustomerName(data.name_Customer);
        });
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Customer/${id}`, {
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
          className="modal modal__content-delete"
        >
          <h2 className="modal__delete__tittle">Eliminar Cliente</h2>
          <p>
            ¿Seguro que quieres eliminar <span>{customerName}</span>?
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