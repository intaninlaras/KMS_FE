import React, { useState } from "react";
import Button from "./Button";
import Icon from "./Icon";
import CardProgram from "./CardProgram";

const CardKK = ({ kk, onChangePage }) => {
  const [isContentVisible, setIsContentVisible] = useState(false);

  const toggleContentVisibility = () => {
    setIsContentVisible(!isContentVisible);
  };

  return (
    <div className="card p-0 mb-3" style={{ borderRadius: "10px" }}>
      <div className="card-body p-0">
        <h5
          className="card-title text-white px-3 py-2"
          style={{
            borderTopRightRadius: "10px",
            borderTopLeftRadius: "10px",
            backgroundColor: "#67ACE9"
          }}
        >
          {kk.Key} {kk["Nama Kelompok Keahlian"]}
        </h5>
        <div className="card-body px-3">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="card-programtitle mb-0">
              <Icon name="align-left" type="Bold" cssClass="btn px-2 py-0 text-primary" title="Program" />
              <span>
                <a href="#" className="text-decoration-underline text-dark">{kk.ProgramCount} Program</a>
              </span>
              <Icon name="users" type="Bold" cssClass="btn px-2 py-0 text-primary ms-3" title="Anggota Kelompok Keahlian" />
              <span>
                <a href="#" className="text-decoration-underline text-dark">{kk.MemberCount} Members</a>
              </span>
            </h6>
            <div className="ps-3" style={{ borderLeft: "solid grey 1px" }}>
              <Button
                iconName={isContentVisible ? "caret-up" : "caret-down"}
                classType="outline-primary btn-sm px-3"
                onClick={toggleContentVisibility}
                title="Detail Kelompok Keahlian"
              />
            </div>
          </div>
          <hr style={{ opacity: "0.1" }} />
          <p
            className="lh-sm"
            style={{
              display: isContentVisible ? "block" : "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}
          >
            {kk.Deskripsi}
          </p>
          {isContentVisible && (
            <>
              {kk.programs.map((program) => (
                <CardProgram key={program.Key} program={program} onChangePage={onChangePage} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardKK;
