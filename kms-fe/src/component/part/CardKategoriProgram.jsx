import React, { useState } from "react";
import Icon from "./Icon";
import AppContext_test from "../page/master-proses/MasterContext.jsx";

const MAX_DESCRIPTION_LENGTH = 100;

const CardKategoriProgram = ({ onChangePage, kategori }) => {
  const [expandDeskripsi, setExpandDeskripsi] = useState(false);

  const handleExpandDescription = () => {
    setExpandDeskripsi(!expandDeskripsi);
  };

  return (
    <>
      <style jsx>{`
        .card-kategori-program {
          transition: transform 0.3s, box-shadow 0.3s;
          flex: 1 1 0;
          min-width: 250px;
          margin: 10px;
        }
        .card-kategori-program:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }
        .card-kategori-program-container {
          display: flex;
          flex-wrap: wrap;
        }
      `}</style>
      <div className="card-kategori-program">
        <div className="card mt-3"
        onClick={() => onChangePage("index",AppContext_test.KategoriIdByKK = kategori.Key)}>
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
                <span>{kategori.materialCount || 0}</span>
              </div>
            </div>
            <div className="d-flex mt-2">
              <div className="me-2 bg-primary ps-1"></div>
              <div className="d-flex flex-column" style={{ width: "50%" }}>
                <p
                  className="lh-sm mb-0"
                  style={{
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    fontSize: "15px",
                    maxHeight: expandDeskripsi ? "none" : "75px",
                    overflow: "hidden",
                    textAlign:'justify'
                  }}
                >
                  {kategori.Deskripsi.length > MAX_DESCRIPTION_LENGTH && !expandDeskripsi ? (
                    <>
                      {kategori.Deskripsi.slice(0, MAX_DESCRIPTION_LENGTH) + " ..."}
                      <a
                        className="btn btn-link text-decoration-none p-0"
                        onClick={handleExpandDescription}
                        style={{ fontSize: "12px" }}
                      >
                        Baca Selengkapnya <Icon name={"caret-down"} />
                      </a>
                    </>
                  ) : (
                    <>
                      {kategori.Deskripsi}
                      {expandDeskripsi && (
                        <a
                          className="btn btn-link text-decoration-none p-0"
                          onClick={handleExpandDescription}
                          style={{ fontSize: "12px" }}
                        >
                          Tutup <Icon name={"caret-up"} />
                        </a>
                      )}
                    </>
                  )}
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
