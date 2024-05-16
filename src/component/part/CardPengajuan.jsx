import React from "react";
import { useState } from "react";
import Icon from "./Icon";
import Input from "./Input";
import Button from "./Button";

function CardPengajuan({
  data,
  onChangePage,
  isShow,
}) {
  const [showAllText, setShowAllText] = useState(isShow);

  const handleToggleText = () => {
    setShowAllText(!showAllText);
  };

  return (
    <>
      {data.map((kk) => {

        return (
          <div className="col-lg-4 mb-3" key={kk.ID}>
            <div
              className="card p-0 h-100"
              style={{
                border: "",
                borderRadius: "0",
              }}
            >
              <div className="card-body p-0">
                <h5
                  className="card-title text-white px-3 pt-2 pb-3 mb-0"
                  style={{
                    backgroundColor: "#67ACE9",
                  }}
                >
                  {kk.Nama}
                </h5>
                <div className="card-body p-3">
                  <div>
                    <Icon
                      name="users"
                      type="Bold"
                      cssClass="btn px-0 pb-1 text-primary"
                      title="Anggota Kelompok Keahlian"
                    />{" "}
                    <span className="fw-semibold">{kk.Count} Anggota</span>
                  </div>
                  <p
                    className="lh-sm"
                    style={{
                      display: showAllText ? "block" : "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {kk.Desc}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <a
                      href="#"
                      className="text-decoration-none"
                      onClick={handleToggleText}
                    >
                      <span className="fw-semibold">
                        {showAllText ? "Ringkas" : "Selengkapnya"}
                      </span>{" "}
                      <Icon
                        name={showAllText ? "arrow-up" : "arrow-right"}
                        type="Bold"
                        cssClass="btn px-0 pb-1 text-primary"
                        title="Baca Selengkapnya"
                      />
                    </a>
                    <Button
                      iconName="plus"
                      classType="primary btn-sm"
                      label="Gabung"
                      onClick={() => onChangePage("add", kk.ID)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default CardPengajuan;
