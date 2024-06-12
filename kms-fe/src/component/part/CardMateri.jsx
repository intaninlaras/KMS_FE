import { useState } from "react";
import Icon from "../part/Icon.jsx";
import Button from "./Button.jsx";
import AppContext_test from "../page/master-proses/MasterContext.jsx";

function CardMateri({ 
  materis, 
  onStatus,
  onEdit,
  onDetail,
  MAX_DESCRIPTION_LENGTH = 50,
  isNonEdit,
}) {

  const [expandDeskripsi, setExpandDeskripsi] = useState({});
  const handleExpandDescription = (bookId) => {
      setExpandDeskripsi((prevState) => ({
          ...prevState,
          [bookId]: !prevState[bookId]
      }));
  };

  const handleStatusChange = (book) => {
      console.log(`Status buku ${book.Key} diubah`);
      onStatus(book.Key);
  };

  return (
    <>
      {materis.map((book) => {

        if (book.Key == null) {
          return null;
        }
        return (
          <div key={book.Key} className="col-lg-6 mb-4">
            <div className="card h-100"> {/* Menambahkan kelas h-100 untuk memastikan kartu memiliki tinggi maksimum */}
              <div
                className="card-header d-flex justify-content-between align-items-center"
                style={{
                  backgroundColor: book.Status === "Aktif" ? '#67ACE9' : '#A6A6A6',
                  color: 'white',
                }}
              >
                <span>{book["Kategori"]}</span>
              </div>
              <div className="card-body bg-white d-flex">
                <img
                  src={book.Gambar}
                  alt={book["Kategori"]}
                  className="img-thumbnail me-3"
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                  }}
                />
                <div>
                  <h5 className="card-title">{book.Judul}</h5>
                  <hr style={{ opacity: "0.1" }} />
                  <div>
                    <p className="card-text p-0 m-0" style={{ fontSize: "12px", maxHeight: "75px", overflow: "hidden" }}> {/* Menambahkan maxHeight dan overflow */}
                      {book.Keterangan.length > MAX_DESCRIPTION_LENGTH && !expandDeskripsi[book.Key] ? (
                        <>
                          {book.Keterangan.slice(0, MAX_DESCRIPTION_LENGTH) + " ..."}
                          <a
                            className="btn btn-link text-decoration-none p-0"
                            onClick={() => handleExpandDescription(book.Key)}
                            style={{ fontSize: "12px" }}
                          >
                            Baca Selengkapnya <Icon name={"caret-down"} />
                          </a>
                        </>
                      ) : (
                        <>
                          {book.Keterangan}
                          {expandDeskripsi[book.Key] && (
                            <a
                              className="btn btn-link text-decoration-none p-0"
                              onClick={() => handleExpandDescription(book.Key)}
                              style={{ fontSize: "12px" }}
                            >
                              Tutup <Icon name={"caret-up"}/>
                            </a>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-footer d-flex justify-content-end bg-white">
                {isNonEdit === false ? (
                  <>
                    {book.Status === "Aktif" && (
                      <button
                        className="btn btn-sm text-primary"
                        title="Edit Materi"
                        onClick={() => onEdit("materiEdit", book)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    )}
                    <button
                      className="btn btn-sm text-primary"
                      title="Detail Materi"
                      onClick={() => onDetail("pretestDetail", AppContext_test.DetailMateri = book)}
                    >
                      {console.log("data context materi dari index:", AppContext_test.DetailMateri)}

                      <i className="fas fa-list"></i>
                    </button>
                    <button
                      className="btn btn-circle"
                      onClick={() => handleStatusChange(book)}
                    >
                      {book.Status === "Aktif" ? (
                        <i
                          className="fas fa-toggle-on text-primary"
                          style={{ fontSize: '20px' }}
                        ></i>
                      ) : (
                        <i
                          className="fas fa-toggle-off text-red"
                          style={{ fontSize: '20px' }}
                        ></i>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-outline-primary"
                    type="button"
                    onClick={() => {
                      onChangePage(
                        "pretest",
                        isDataReadyTemp,
                        materiIdTemp
                      );
                    }}
                    style={{ }}
                  >
                    Baca Materi
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default CardMateri;
