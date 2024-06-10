import React, { useState } from "react";
import Icon from "./Icon";

const CardKategoriProgram = ({ onChangePage, kategori }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
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
          flex-fill: wrap;
        }
        .short-description {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2; 
          -webkit-box-orient: vertical;
        }
        .read-more {
          cursor: pointer;
          color: blue;
          text-decoration: underline;
        }
      `}</style>
      <div className="card-kategori-program">
        <div
          className="card mt-3"
           onClick={() => onChangePage("index", kategori.Key)}
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
                <span>{kategori.materialCount || 0}</span>
              </div>
            </div>
            <div className="d-flex mt-2">
              <div className="me-2 bg-primary ps-1"></div>
              <div className="d-flex flex-column"> 
                <p 
                  className={`card-subtitle ${showFullDescription ? '' : 'short-description'}`} 
                >
                  {kategori.Deskripsi}
                </p>
                {!showFullDescription && kategori.Deskripsi.length > 50 && (
                  <span className="read-more" onClick={toggleDescription}>
                    Baca Selengkapnya
                  </span>
                )}
                {showFullDescription && (
                  <span className="read-more" onClick={toggleDescription}>
                    Tutup
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardKategoriProgram;