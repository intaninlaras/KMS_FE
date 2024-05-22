import React, { forwardRef } from "react";
import Button from "./Button";
import Icon from "./Icon";

const CardProgram = ({
  id,
  data,
  isActive,
  onClick,
  children,
  onChangePage,
}) => {
  return (
    <div
      id={id}
      className={`card card-program mt-3 ${isActive ? "border-secondary" : ""}`}
    >
      <div
        className={`card-body d-flex justify-content-between ${
          isActive ? "align-items-center border-bottom border-secondary" : ""
        }`}
      >
        <p className="fw-medium mb-0 text-center" style={{ width: "15%" }}>
          {data["Nama Program"]}
        </p>
        <p
          className="mb-0 pe-3"
          style={{
            width: "65%",
            display: isActive ? "block" : "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {data.Deskripsi}
        </p>
        <div
          className="d-flex justify-content-between align-items-center px-3"
          style={{
            width: "15%",
            borderLeft: "solid grey 1px",
          }}
        >
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
        <div
          className="ps-3"
          style={{
            borderLeft: "solid grey 1px",
          }}
        >
          <Button
            iconName={isActive ? "caret-up" : "caret-down"}
            classType="outline-primary btn-sm px-3"
            onClick={onClick}
            title="Detail Kelompok Keahlian"
          />
        </div>
      </div>
      <div
        className="card-body"
        style={{ display: isActive ? "block" : "none" }}
      >
        <Button
          iconName="add"
          classType="primary btn-sm mb-2"
          label="Tambah Mata Kuliah"
          onClick={() => onChangePage("addKategori", data)}
        />
        {children}
      </div>
    </div>
  );
};

export default CardProgram;
