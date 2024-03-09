const Alerta = ({ tipo, texto }) => {
    return (
      <div className="alert__container">
        <p>
          {tipo === "error" ? (
            <>
              <i class="bx bxs-error"></i>
            </>
          ) : (
            <></>
          )}
        </p>

        <p className="alert__text">{texto}</p>
      </div>
    );
}
 
export default Alerta;