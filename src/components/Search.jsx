const Search = ({
  options,
  filterByProperty,
  setFilterByProperty,
  filterValue,
  setFilterValue,
}) => {


  return (
      <div className="search__container">
          <h3 className="search__tittle">
            Filtro
          </h3> 
        <label htmlFor="filterByProperty">Buscar por:</label>
      <select
        value={filterByProperty}
        onChange={(e) => setFilterByProperty(e.target.value)}
      >
        <option disabled value="">- Seleccionar -</option>
        {Object.entries(options).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
      />
     
    </div>
  );
};

export default Search;
