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
    KK: "",
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
        } else if (Array.isArray(data) && data.length > 0) {
          setUserData(data[0]);
          setCurrentFilter((prevFilter) => ({
            ...prevFilter,
            kry_id: data[0].kry_id,
          }));
        } else {
          throw new Error("Data pengguna tidak ditemukan atau format tidak valid.");
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
  }, []);


  useEffect(() => {
    const fetchDataKK = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(API_LINK + "Pengajuans/GetAnggotaKK",
          currentFilter
        );
        console.log("ADADA : " + JSON.stringify(data));

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
