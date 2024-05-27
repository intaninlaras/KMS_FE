import React from "react";
import '@fortawesome/fontawesome-free/css/all.css';

function CardMateri({ item, onChangePage, handleSetStatus }) {
  return (
    <div key={item.Key} className="col-lg-6 mb-4">
      <div className="card">
        <div
          className="card-header d-flex justify-content-between align-items-center"
          style={{
            backgroundColor: item.Status === "Aktif" ? '#67ACE9' : '#A6A6A6',
            color: 'white',
          }}
        >
          <span>{item.Kategori}</span>
        </div>
        <div className="card-body bg-white d-flex">
          <img
            src={item.Gambar}
            alt={item["Nama Materi"]}
            className="img-thumbnail me-3"
            style={{
              width: '150px',
              height: '150px',
              objectFit: 'cover',
            }}
          />
          <div>
            <h5 className="card-title">{item.Judul}</h5>
            <hr style={{ opacity: "0.1" }} />
            <p className="card-text">{item.Keterangan}</p>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-end bg-white">
          <button
            className="btn btn-sm text-primary"
            title="Edit Materi"
            onClick={() => onChangePage("edit")}
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="btn btn-sm text-primary"
            title="Detail Materi"
            onClick={() => onChangePage("detail")}
          >
            <i className="fas fa-list"></i>
          </button>
          <button
            className="btn btn-circle"
            onClick={() => handleSetStatus(item.Key)}
          >
            {item.Status === "Aktif" ? (
              <i
                className="fas fa-toggle-on text-primary"
                style={{ fontSize: '20px' }}
              ></i>
            ) : (
              <i
                className="fas fa-toggle-off text-white"
                style={{ fontSize: '20px' }}
              ></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardMateri;
