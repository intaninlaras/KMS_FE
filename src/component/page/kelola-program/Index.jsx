import { useEffect, useRef, useState } from "react";
import { API_LINK } from "../../util/Constants";
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

export default function ProgramIndex() {
  const [isOpen, setIsOpen] = useState(true);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState([]);

  useEffect(() => {
    setIsError(false);
    UseFetch(API_LINK + "Program/GetDataKKByPIC")
      .then((data) => {
        if (data === "ERROR") setIsError(true);
        else {
          setCurrentData(data[0]);
        }
      })
      .then(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    console.log(JSON.stringify(currentData));
  }, [currentData]);

  return (
    <>
      <div className="d-flex flex-column">
        <div className="flex-fill">
          {/* <div className="input-group">
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
          </div> */}
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
                      {currentData["Nama Kelompok Keahlian"]}
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
                              0 Program
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
                              1 Anggota
                            </a>
                          </span>
                          {/* <Icon
                            name="clock"
                            type="Bold"
                            cssClass="btn px-2 py-0 text-primary ms-3"
                            title="Menunggu Persetujuan"
                          />
                          <span>
                            <a
                              href=""
                              className="text-decoration-underline text-dark"
                            >
                              2 Menunggu persetujuan
                            </a>
                          </span> */}
                        </h6>
                        <div className="action d-flex">
                          <Button
                            iconName="add"
                            classType="primary btn-sm me-2"
                            label="Tambah Program"
                          />
                          <Button
                            iconName="list"
                            classType="outline-primary btn-sm px-3 me-2"
                            title="Detail Kelompok Keahlian"
                          />
                          {/* <Button
                            iconName={
                              isContentVisible ? "caret-up" : "caret-down"
                            }
                            classType="outline-primary btn-sm px-3"
                            onClick={toggleContentVisibility}
                            title="Detail Kelompok Keahlian"
                          /> */}
                        </div>
                      </div>
                      <hr style={{ opacity: "0.1" }} />
                      <p
                        className="lh-sm"
                        style={{
                          // display: isContentVisible ? "block" : "-webkit-box",
                          display: "block",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        Programming adalah bidang keilmuan yang menjelaskan
                        tentang pengkodean untuk pembuatan aplikasi website,
                        mobile, desktop dan lain-lain. Jadi, programming adalah
                        suatu proses atau kegiatan menulis dan menguji
                        (pemrograman) agar program dapat dibuat, dan hasilnya
                        sesuai apa yang diinginkan.
                      </p>
                      <CardProgram isOpen={isOpen} />
                      <CardProgram isOpen={isOpen} />
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
