import React from "react";
import { useState } from "react";
import Icon from "./Icon";
import Input from "./Input";
import Button from "./Button";

function CardPengajuan({ data, onChangePage, isShow }) {
  const [showAllText, setShowAllText] = useState(isShow);
  const sortDataByStatus = (data) => {
    const statusOrder = {
      Aktif: 1,
      "Menunggu Acc": 2,
      None: 3,
      Ditolak: 4,
      Dibatalkan: 5,
      Kosong: 6,
    };

    return data.sort((a, b) => {
      return statusOrder[a.Status] - statusOrder[b.Status];
    });
  };

  const sortedData = sortDataByStatus(data);

  const handleToggleText = () => {
    setShowAllText(!showAllText);
  };

  return (
    <>
      {sortedData.map((kk, index) => (
        <div className="col-lg-4 mb-3" key={kk.ID || index}>
          <div
            className="card p-0 h-100"
            style={{
              border: "",
              borderRadius: "0",
            }}
          >
            <div className="card-body p-0">
              <h5
                className="card-title text-white px-3 pt-2 pb-2 mb-0"
                style={{
                  backgroundColor:
                    kk.Status === "Aktif"
                      ? "#67ACE9"
                      : kk.Status === "Menunggu Acc"
                      ? "#ffcc00"
                      : kk.Status === "None" || kk.Status === "Ditolak"
                      ? "#6C757D"
                      : "#6C757D", // default to grey if status is not recognized
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
                  {kk.Status === "Aktif" ? (
                    "Tergabung"
                  ) : kk.Status === "Ditolak" ||
                    kk.Status === "None" ||
                    kk.Status === "Dibatalkan" ? (
                    <>
                      <Button
                        iconName="list"
                        classType="primary btn-sm"
                        label="Detail"
                        onClick={() => onChangePage("detailKK", kk)}
                        title="Klik untuk melihat detail"
                      />
                    </>
                  ) : kk.Status === "Menunggu Acc" ? (
                    <>
                      <Button
                        iconName="list"
                        classType="primary btn-sm"
                        label="Detail"
                        onClick={() => onChangePage("detail", kk)}
                        title="Klik untuk melihat detail"
                      />
                    </>
                  ) : (
                    <>
                      <Button
                        iconName="plus"
                        classType="primary btn-sm"
                        label="Gabung"
                        onClick={() => onChangePage("add", kk)}
                        title="Klik untuk bergabung"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default CardPengajuan;
