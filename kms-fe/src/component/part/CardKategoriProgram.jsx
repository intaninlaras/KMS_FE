import React from "react";

const CardKategoriProgram = ({ onChangePage, kategori }) => {

  const cardStyle = {
    transition: "transform 0.3s, box-shadow 0.3s",
    ":hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)"
    }
  };

  return (
    <div className="col">
      <div
        className="card card-kategori-program mt-3"
        onClick={() => onChangePage("index", kategori.Key)}
      >
        <div className="card-body"
         onClick={onChangePage}
         style={cardStyle}>
          <div className="d-flex justify-content-between">
            <h6 className="card-title">{kategori["Nama Kategori Program"]}</h6>
          </div>
          <div className="d-flex mt-2">
            <div className="me-2 bg-primary ps-1"></div>
            <p className="card-subtitle">{kategori.Deskripsi}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardKategoriProgram;