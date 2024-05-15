import React, { useState } from "react";
import Button from "./Button";
import Icon from "./Icon";
import Input from "./Input";

const CardProgram = ({ isOpen }) => {
  const [isContentVisible, setIsContentVisible] = useState(isOpen);

  const toggleContentVisibility = () => {
    setIsContentVisible(!isContentVisible);
  };

  return (
    <div
      className={`card card-program mt-3 ${
        isContentVisible ? "border-primary" : ""
      }`}
      style={{ display: isOpen ? "block" : "none" }}
    >
      <div
        className={`card-body d-flex justify-content-between ${
          isContentVisible
            ? "align-items-center border-bottom border-primary"
            : ""
        }`}
      >
        <p className="fw-medium mb-0" style={{ width: "15%" }}>
          HR Generalist
        </p>
        <p
          className="mb-0"
          style={{
            width: "65%",
            display: isContentVisible ? "block" : "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          HR Generalist atau HRD Umum adalah bagian yang sangat penting.
          Mereka bertugas melakukan tugas-tugas yang berkaitan dengan
          pengelolaan sumber daya manusia dalam perusahaan dan melapor ke
          Manajer HR atau Direktur HR.
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
            iconName={isContentVisible ? "caret-up" : "caret-down"}
            classType="outline-primary btn-sm px-3"
            onClick={toggleContentVisibility}
            title="Detail Kelompok Keahlian"
          />
        </div>
      </div>
      <div
        className="card-body"
        style={{ display: isContentVisible ? "block" : "none" }}
      >
        <Button iconName="add" classType="primary btn-sm" label="Tambah" />
        <div className="row row-cols-3">
          {/* Card Kategori Program */}
          <div className="col">
            <div className="card card-kategori-program mt-3">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h6 className="card-title">HR Generalist Fundamental</h6>
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
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Inventore, quae!
                  </p>
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
          <div className="col">
            <div className="card card-kategori-program mt-3">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h6 className="card-title">HR Generalist Fundamental</h6>
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
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Inventore, quae!
                  </p>
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
          <div className="col">
            <div className="card card-kategori-program mt-3">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h6 className="card-title">HR Generalist Fundamental</h6>
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
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Inventore, quae!
                  </p>
                </div>
                <div className="d-flex justify-content-between mt-3 align-items-center">
                  <p className="text-danger mb-0" style={{ fontSize: "14px" }}>
                    Draft
                  </p>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProgram;
