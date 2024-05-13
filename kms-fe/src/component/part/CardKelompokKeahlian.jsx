import React from "react";
import Icon from "./Icon";
import Input from "./Input";

function CardKelompokKeahlian({
  type,
  title,
  prodi,
  desc,
  checked,
  relatedPerson,
  personCount,
}) {
  return (
    <div className="col-md-6">
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
          <h5
            className="card-title text-white px-3 py-2"
            style={{
              borderTopRightRadius: "10px",
              borderTopLeftRadius: "10px",
              backgroundColor: type === "active" ? "#67ACE9" : "#A6A6A6",
            }}
          >
            {title}
          </h5>
          <div className="card-body px-3">
            <h6 className="card-subtitle">
              <span
                className="bg-primary me-2"
                style={{ padding: "2px" }}
              ></span>
              {prodi}
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
              {desc}
            </p>
            <hr style={{ opacity: "0.1" }} />
            {type === "active" ? (
              <div className="d-flex justify-content-between">
                <div className="img-container" style={{ width: "25%" }}>
                  {relatedPerson.map((person, index) => (
                    <a key={index} href={person.link}>
                      <img
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
                      <span>
                        <a
                          key={index}
                          href={person.link}
                          className="fw-bold text-dark text-decoration-none"
                        >
                          {person.name}
                          {", "}
                        </a>
                      </span>
                    ))}
                    dan {personCount} Lainnya sudah bergabung!
                  </p>
                </div>
                <div className="d-flex" style={{ width: "20%" }}>
                  <Icon
                    name="edit"
                    type="Bold"
                    cssClass="btn px-2 py-0 text-primary"
                    title="Edit"
                  />
                  <Icon
                    name="list"
                    type="Bold"
                    cssClass="btn px-2 py-0 text-primary"
                    title="List"
                  />
                  <div
                    class="form-check form-switch py-0 ms-2"
                    style={{ width: "fit-content" }}
                  >
                    <Input
                      type="checkbox"
                      forInput=""
                      label=""
                      className="form-check-input"
                      checked={checked}
                    />
                    <label
                      className="form-check-label"
                      for="flexSwitchCheckDefault"
                    ></label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="d-flex justify-content-end">
                <Icon
                  name="edit"
                  type="Bold"
                  cssClass="btn px-2 py-0 text-primary"
                  title="Edit"
                />
                <Icon
                  name="trash"
                  type="Bold"
                  cssClass="btn px-2 py-0 text-primary"
                  title="Hapus"
                />
                <Icon
                  name="list"
                  type="Bold"
                  cssClass="btn px-2 py-0 text-primary"
                  title="Detail"
                />
                <Icon
                  name="paper-plane"
                  type="Bold"
                  cssClass="btn px-1 py-0 text-primary"
                  title="Kirim Pengajuan"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardKelompokKeahlian;
