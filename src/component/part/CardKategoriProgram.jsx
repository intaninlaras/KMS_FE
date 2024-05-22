import React, { forwardRef } from "react";
import Icon from "./Icon";
import Input from "./Input";

const CardKategoriProgram = ({ data }) => {
  return (
    <div className="col">
      <div className="card card-kategori-program mt-3">
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <h6 className="card-title">{data["Nama Kategori"]}</h6>
            {/* <div>
              <Icon
                name="file"
                type="Bold"
                cssClass="btn px-2 py-0"
                title="Materi"
              />
              <span>5</span>
            </div> */}
          </div>
          <div className="d-flex mt-2">
            <div className="me-2 bg-primary ps-1"></div>
            <p className="card-subtitle">{data.Deskripsi}</p>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <Icon
              name="check"
              type="Bold"
              cssClass="btn px-2 py-0 text-primary"
              title="Sudah di Publikasi"
            />
            <Icon
              name="edit"
              type="Bold"
              cssClass="btn px-2 py-0 text-primary"
              title="Ubah Program"
            />
            <Icon
              name="list"
              type="Bold"
              cssClass="btn px-2 py-0 text-primary"
              title="Detail"
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
              />
              <label
                className="form-check-label"
                for="flexSwitchCheckDefault"
              ></label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardKategoriProgram;
