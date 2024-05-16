import React, { useState } from "react";
import Button from "./Button";
import Icon from "./Icon";
import Input from "./Input";

const CardProgram = ({ isOpen, onChangePage }) => {
  const [isContentVisible, setIsContentVisible] = useState(isOpen);

  const toggleContentVisibility = () => {
    setIsContentVisible(!isContentVisible);
  };

  return (
    <>
      <style jsx>{`
        .card-kategori-program {
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .card-kategori-program:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
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
              width: "95%",
              display: isContentVisible ? "block" : "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            HR Generalist atau HRD Umum adalah bagian yang sangat penting.
            Mereka bertugas melakukan tugas-tugas yang berkaitan dengan
            pengelolaan sumber daya manusia dalam perusahaan dan melapor ke
            Manajer HR atau Direktur HR.
          </p>
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
          <div className="row row-cols-3">
            {/* Card Kategori Program */}
            <div className="col">
              <div
                className="card card-kategori-program mt-3"
                onClick={() => onChangePage("index")}
              >
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
                      Berisi dasar-dasar fundamental tentang ilmu Manajemen 
                      Sumber Daya Manusia.
                    </p>
                  </div>
                  <div className="d-flex justify-content-end mt-3"></div>
                </div>
              </div>
            </div>
            <div className="col">
              <div
                className="card card-kategori-program mt-3"
                onClick={() => onChangePage("index")}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h6 className="card-title">Manajemen Pengembangan SDM</h6>
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
                      Berisi perencanaan pengembangan karyawan, mulai dari 
                      pelatihan hingga evaluasi.
                    </p>
                  </div>
                  <div className="d-flex justify-content-end mt-3"></div>
                </div>
              </div>
            </div>
            <div className="col">
              <div
                className="card card-kategori-program mt-3"
                onClick={() => onChangePage("index")}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h6 className="card-title">Proses Perekrutan dan Seleksi</h6>
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
                      Berisi metode perekrutan, teknik seleksi, dan 
                      etika dalam perekrutan dan seleksi.
                    </p>
                  </div>
                  <div className="d-flex justify-content-end mt-3 align-items-center">
                    <div className="d-flex justify-content-end"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardProgram;
