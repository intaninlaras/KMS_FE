import React, { useState } from "react";
import Button from "./Button";
import CardKategoriProgram from "./CardKategoriProgram";

const CardProgram = ({ program, onChangePage }) => {
  const [isContentVisible, setIsContentVisible] = useState(false);

  const toggleContentVisibility = () => {
    setIsContentVisible(!isContentVisible);
  };

  return (
    <div className={`card card-program mt-3 ${isContentVisible ? "border-primary" : ""}`}>
      <div className={`card-body d-flex justify-content-between ${isContentVisible ? "align-items-center border-bottom border-primary" : ""}`}>
        <p className="fw-medium mb-0" style={{ width: "15%" }}>
          {program["Nama Program"]}
        </p>
        <p
          className="mb-0"
          style={{
            width: "70%",
            display: isContentVisible ? "block" : "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {program.Deskripsi}
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
            title="Detail Program"
          />
        </div>
      </div>
      {isContentVisible && (
        <div className="mt-3 card-kategori-program-container"> 
          {program.categories.map((kategori) => (
            <CardKategoriProgram 
              key={kategori.Key} 
              kategori={kategori} 
              onChangePage={onChangePage} 
            />
          ))} {/* Added closing parenthesis here */}
        </div>
      )}
    </div>
  );
};

export default CardProgram;
