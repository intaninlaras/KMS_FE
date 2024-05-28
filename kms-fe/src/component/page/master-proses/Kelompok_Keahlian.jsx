import { useEffect, useRef, useState } from "react";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Table from "../../part/Table";
import Paging from "../../part/Paging";
import Filter from "../../part/Filter";
import DropDown from "../../part/Dropdown";
import Alert from "../../part/Alert";
import Loading from "../../part/Loading";
import Icon from "../../part/Icon";
import CardProgram from "../../part/CardProgram";

export default function SubKKIndex({ onChangePage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);

  const toggleContentVisibility = () => {
    setIsContentVisible(!isContentVisible);
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="d-flex flex-column">
        <div className="flex-fill">
          <div className="input-group"> 
            <Input
              //   ref={searchQuery}
              forInput="pencarianProduk"
              placeholder="Cari"
            />
            <Button
              iconName="search"
              classType="primary px-4"
              title="Cari"
              //   onClick={handleSearch}
            />
            <Filter>
              <DropDown
                // ref={searchFilterSort}
                forInput="ddUrut"
                label="Urut Berdasarkan"
                type="none"
                // arrData={dataFilterSort}
                defaultValue="[Kode Produk] asc"
              />
              <DropDown
                // ref={searchFilterJenis}
                forInput="ddJenis"
                label="Jenis Produk"
                type="semua"
                // arrData={dataFilterJenis}
                defaultValue=""
              />
              <DropDown
                // ref={searchFilterStatus}
                forInput="ddStatus"
                label="Status"
                type="none"
                // arrData={dataFilterStatus}
                defaultValue="Aktif"
              />
            </Filter>
          </div>
          <div className="container">
            <div className="row mt-3 gx-4">
              {/* <CardProgram isOpen={isOpen} isOpenProgram={isOpenProgram} /> */}
              <div className="col-md-12">
                <div
                  className="card p-0 mb-3"
                  style={{
                    border: "",
                    borderRadius: "10px",
                  }}
                >
                  <div className="card-body p-0">
                    <h5
                      className="card-title text-white px-3 py-2"
                      style={{
                        borderTopRightRadius: "10px",
                        borderTopLeftRadius: "10px",
                        backgroundColor: "#67ACE9",
                      }}
                    >
                      Kelompok Keahlian
                    </h5>
                    <div className="card-body px-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="card-programtitle mb-0">
                          <Icon
                            name="align-left"
                            type="Bold"
                            cssClass="btn px-2 py-0 text-primary"
                            title="Program"
                          />
                          <span>
                            <a
                              href=""
                              className="text-decoration-underline text-dark"
                            >
                              3 Program
                            </a>
                          </span>
                          <Icon
                            name="users"
                            type="Bold"
                            cssClass="btn px-2 py-0 text-primary ms-3"
                            title="Anggota Kelompok Keahlian"
                          />
                          <span>
                            <a
                              href=""
                              className="text-decoration-underline text-dark"
                            >
                              5 Members
                            </a>
                          </span>
                        </h6>
                        <div className="action d-flex">
                          {/* <Button
                            iconName="list"
                            classType="outline-primary btn-sm px-3 me-2"
                            title="Detail Kelompok Keahlian"
                            onClick={() => onChangePage("detail")}
                          /> */}
                          <Button
                            iconName={
                              isContentVisible ? "caret-up" : "caret-down"
                            }
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
                          overflow: "hidden",
                        }}
                      >
                        Manajemen Informatika adalah cabang dari manajemen yang berfokus pada pengelolaan sumber daya teknologi informasi (TI) 
                        dalam suatu organisasi dengan tujuan meningkatkan efisiensi, efektivitas, dan nilai bisnis. Ini melibatkan perencanaan, 
                        pengembangan, implementasi, dan pemeliharaan sistem informasi dan teknologi informasi yang digunakan dalam konteks organisasi.
                      </p>
                      <CardProgram isOpen={isOpen} onChangePage={onChangePage} />
                      {/* <CardProgram isOpen={isOpen} onChangePage={onChangePage} /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
