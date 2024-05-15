import React from "react";
import Icon from "./Icon";
import Button from "./Button";
import Input from "./Input";
import { Link, useNavigate } from "react-router-dom";

function CardKelompokKeahlian({
  navigate = useNavigate(),
  onDetail = () => { },
  type,
  title,
  menu,
  prodi,
  desc,
  checked,
  relatedPerson,
  personCount,
  keahlian,
  onChangePage,
}) {
  return (
    <>
      {keahlian.map((book) => (
        <div className="col-md-6" key={book.Key}>
          <div
            className="card p-0"
            style={{
              border: "",
              borderRadius: "10px",
              borderBottomRightRadius: "0",
              borderBottomLeftRadius: "0",
            }}
          >
            <div className="card-body p-0">
              <Link className="btn btn-link p-0 text-decoration-none w-100" to={`/kelola_pustaka/daftar_pustaka/${title}`}>
                <h5
                  className="card-title text-white px-3 py-2"
                  style={{
                    borderTopRightRadius: "10px",
                    borderTopLeftRadius: "10px",
                    backgroundColor: type === "active" ? "#67ACE9" : "#A6A6A6",
                    textAlign: "left",
                  }}
                >
                  {book["Nama Kelompok Keahlian"]}
                </h5>
              </Link>
              <div className="card-body px-3">
                <h6 className="card-subtitle">
                  <span
                    className="bg-primary me-2"
                    style={{ padding: "2px" }}
                  ></span>
                  {book.PIC}
                </h6>
                <hr style={{ opacity: "0.1" }} />
                <p
                  className="lh-sm"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {book.Deskripsi}
                </p>
                <hr style={{ opacity: "0.1" }} />
                {menu === "kk" ? (
                  <div className="d-flex justify-content-between">
                    <div className="img-container" style={{ width: "28%" }}>
                      {relatedPerson.map((person, index) => (
                        <a key={index} href={person.link}>
                          <img
                            key={person.name} // Provide a unique key for each img element
                            src={person.imgSource}
                            alt={person.name}
                            className="img-fluid rounded-circle"
                            width="45"
                            style={{
                              position: "relative",
                              left: `${-15 * index}px`,
                              zIndex: `${3 - index}`,
                              border: "solid black 1px",
                            }}
                          />
                        </a>
                      ))}
                    </div>
                    <div style={{ width: "55%", marginLeft: "-10px" }}>
                      <p className="lh-sm mb-0">
                        {relatedPerson.map((person, index) => (
                          <span key={index}>
                            <a
                              href={person.link}
                              className="fw-bold text-dark text-decoration-none"
                            >
                              {person.name}
                              {index !== relatedPerson.length - 1 && ", "} {/* Add a comma for all except the last item */}
                            </a>
                          </span>
                        ))}
                        dan {personCount} Lainnya sudah bergabung!
                      </p>
                    </div>
                    <div className="d-flex">
                      <Button
                        iconName="list"
                        onClick={() => onChangePage("detail", book)}
                        style={{ color: "blue" }}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "right" }}>
                    <Button
                      iconName={"caret-right"}
                      label="Pilih Pustaka"
                      onClick={() => onChangePage("index","kelola",book.Key)}
                      style={{ border: "1px solid #67ACE9", borderRadius: "5px" }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default CardKelompokKeahlian;
