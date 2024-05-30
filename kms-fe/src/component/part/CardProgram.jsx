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
            Software & IOT Engineering
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
            Software Engineering adalah disiplin ilmu yang berfokus pada pengembangan perangkat lunak dengan 
            menggunakan prinsip-prinsip rekayasa yang sistematis dan terstruktur. Ini melibatkan proses mulai 
            dari perencanaan, desain, pengembangan, pengujian, hingga pemeliharaan perangkat lunak untuk memastikan kualitas, 
            keandalan, dan keberlanjutan sistem. Software Engineering melibatkan pemahaman yang mendalam tentang kebutuhan pengguna, 
            rekayasa perangkat lunak, metodologi pengembangan, dan praktik manajemen proyek.  
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
                onClick={() => onChangePage("index","1")}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h6 className="card-title">UI / UX Engineer</h6>
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
                      UI/UX Engineer menggabungkan elemen-elemen dari Desain Antarmuka Pengguna (UI) dan Pengalaman Pengguna 
                      (UX) dengan pemahaman yang kuat tentang pengembangan perangkat lunak. Mereka bertanggung jawab untuk merancang, 
                      mengembangkan, dan mengimplementasikan antarmuka pengguna yang intuitif, efisien, dan menarik untuk aplikasi dan 
                      situs web.
                    </p>
                  </div>
                  <div className="d-flex justify-content-end mt-3"></div>
                </div>
              </div>
            </div>
            <div className="col">
              <div
                className="card card-kategori-program mt-3"
                onClick={() => onChangePage("index","1")}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h6 className="card-title">Software Engineer</h6>
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
                      Software Engineering adalah disiplin ilmu yang berkaitan dengan pengembangan perangkat lunak secara sistematis, terstruktur, dan terorganisir. Tujuannya adalah untuk menciptakan solusi perangkat lunak yang berkualitas tinggi, andal, dan efisien untuk memenuhi kebutuhan pengguna atau masalah bisnis yang spesifik.  
                    </p>
                  </div>
                  <div className="d-flex justify-content-end mt-3 align-items-center">
                    <div className="d-flex justify-content-end"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div
                className="card card-kategori-program mt-3"
                onClick={() => onChangePage("index","1")}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h6 className="card-title">Full-Stack (Web) Developer</h6>
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
                      Full-Stack Web Developer tentang teknologi dan bahasa pemrograman yang digunakan di kedua lingkungan tersebut, serta kemampuan untuk merancang, mengembangkan, dan mendeploy aplikasi web secara lengkap.
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
