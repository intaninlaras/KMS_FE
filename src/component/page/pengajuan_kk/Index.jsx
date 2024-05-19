import React from "react";
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
import CardKK from "../../part/CardKelompokKeahlian";
import CardPengajuan from "../../part/CardPengajuan";
import { ListKelompokKeahlian } from "../../util/Dummy";
import { API_LINK } from "../../util/Constants";
import Cookies from "js-cookie";
import { decryptId } from "../../util/Encryptor";

const inisialisasiKK = [
  {
    Key: null,
    No: null,
    Nama: null,
    PIC: null,
    Deskripsi: null,
    Status: "Aktif",
    Count: 0,
  },
];

export default function PengajuanIndex({ onChangePage }) {
  let activeUser = "";
  const cookie = Cookies.get("activeUser");
  if (cookie) activeUser = JSON.parse(decryptId(cookie)).username;

  const [show, setShow] = useState(false);
  const [isError, setIsError] = useState(false);
  const [listKK, setListKK] = useState(inisialisasiKK);

  const [userData, setUserData] = useState({
    Role: "",
    Nama: "",
    kry_id: "",
  });

  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    KK:"",
    sort: "Nama ASC",
    status: "",
    kry_id: "",
  });

  const handleToggleText = () => {
    setShow(!show);
  };

  useEffect(() => {
    const fetchDataUser = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(API_LINK + "Utilities/GetUserLogin", {
          param: activeUser,
        });

        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal mengambil daftar prodi.");
        } else {
          setUserData(data[0]);
          // console.log(data[0]);
          setCurrentFilter((prevFilter) => ({
            ...prevFilter,
            kry_id: data[0].kry_id,
          }));
        }
      } catch (error) {
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
        setUserData(null);
      }
    };

    fetchDataUser();
  }, [activeUser]);

  useEffect(() => {
    const fetchDataKK = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(API_LINK + "Pengajuans/GetAnggotaKK",
          currentFilter
         );
        // console.log("ADADA : " + JSON.stringify(data));

        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal mengambil daftar prodi.");
        } else {
          // Mengubah data menjadi format yang diinginkan
          const formattedData = data.map(item => ({
            ...item,
          }));
          setListKK(formattedData);
        }
      } catch (error) {
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
        setListKK([]);
      }
    };

    fetchDataKK();

  }, [currentFilter]);

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
              {/* <div className="col-lg-4 mb-3">
                 <div
                  className="card p-0 h-100"
                  style={{
                    border: "",
                    borderRadius: "0",
                  }}
                >
                  <div className="card-body p-0">
                    <h5
                      className="card-title text-white px-3 pt-2 pb-3 mb-0"
                      style={{
                        backgroundColor: "#A6A6A6",
                      }}
                    >
                      Data Scientist
                    </h5>
                    <div className="card-body p-3">
                      <div>
                        <Icon
                          name="users"
                          type="Bold"
                          cssClass="btn px-0 pb-1 text-primary"
                          title="Anggota Kelompok Keahlian"
                        />{" "}
                        <span className="fw-semibold">4 Anggota</span>
                      </div>
                      <p
                        className="lh-sm"
                        style={{
                          display: show ? "block" : "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        Seorang data scientist atau ilmuwan data adalah
                        seorang yang bertanggung jawab dalam hal mengumpulkan,
                        menganalisis, dan menafsirkan data untuk membantu pengambilan
                        keputusan dalam suatu organisasi.
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <a
                          href="#"
                          className="text-decoration-none"
                          onClick={handleToggleText}
                        >
                          <span className="fw-semibold">
                            {show ? "Ringkas" : "Selengkapnya"}
                          </span>{" "}
                          <Icon
                            name={show ? "arrow-up" : "arrow-right"}
                            type="Bold"
                            cssClass="btn px-0 pb-1 text-primary"
                            title="Baca Selengkapnya"
                          />
                        </a>
                        <div>
                          <Icon
                            name="list"
                            type="Bold"
                            cssClass="btn px-2 py-0 text-primary"
                            title="Detail Pengajuan"
                            onClick={() => onChangePage("detail")}
                          />
                          <Icon
                            name="check"
                            type="Bold"
                            cssClass="btn px-2 py-0 text-primary"
                            title="Berhasil Diajukan"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </div> */}
              <CardPengajuan
                data={listKK}
                onChangePage={onChangePage}
                isShow={show}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
