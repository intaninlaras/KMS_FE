import React from "react";
import Icon from "./Icon";

const CardKategoriProgram = ({ onChangePage, kategori }) => {
  return (
    <>
    <style jsx>{`
    .card-kategori-program {
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .card-kategori-program:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    }
  `}</style>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            <div className="col mb-3">
              <div
                className="card card-kategori-program mt-3"
                onClick={() => onChangePage("index", kategori.Key)}
                style={{ margin: "0 10px" }}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                  <h6 className="card-title">{kategori["Nama Kategori Program"]}</h6>
                    <div>
                      <Icon
                        name="file"
                        type="Bold"
                        cssClass="btn px-2 py-0"
                        title="Materi"
                      />
                      <span>5</span>
                    </div>
                  </div>
                  <div className="d-flex mt-2">
                    <div className="me-2 bg-primary ps-1"></div>
                    <p className="card-subtitle">
                    {kategori.Deskripsi}
                    </p>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          </>
  );
};

export default CardKategoriProgram;