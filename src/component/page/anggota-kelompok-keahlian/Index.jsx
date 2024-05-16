import React from "react";
import { useEffect, useRef, useState } from "react";
import { API_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Input from "../../part/Input";
import DropDown from "../../part/Dropdown";
import Filter from "../../part/Filter";
import CardKK from "../../part/CardKelompokKeahlian";
import Icon from "../../part/Icon";

const dataFilterSort = [
  { Value: "[Nama Kelompok Keahlian] asc", Text: "Nama Kelompok Keahlian [↑]" },
  {
    Value: "[Nama Kelompok Keahlian] desc",
    Text: "Nama Kelompok Keahlian  [↓]",
  },
];

const dataFilterStatus = [
  { Value: "", Text: "No Filter" },
  { Value: "Draft", Text: "Draft" },
  { Value: "Aktif", Text: "Aktif" },
  { Value: "Tidak Aktif", Text: "Tidak Aktif" },
];

export default function AnggotaKKIndex({ onChangePage }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState([]);
  const [message, setMessage] = useState("");
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "[Nama Kelompok Keahlian] asc",
    status: "Aktif",
  });

  const searchQuery = useRef();
  const searchFilterSort = useRef();
  const searchFilterStatus = useRef();

  function handleSetCurrentPage(newCurrentPage) {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => {
      return {
        ...prevFilter,
        page: newCurrentPage,
      };
    });
  }

  function handleSearch() {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => {
      return {
        ...prevFilter,
        page: 1,
        query: searchQuery.current.value,
        sort: searchFilterSort.current.value,
        status: searchFilterStatus.current.value,
      };
    });
  }

  useEffect(() => {
    setIsError(false);
    UseFetch(API_LINK + "KKs/GetDataKK", currentFilter)
      .then((data) => {
        if (data === "ERROR") setIsError(true);
        else {
          const formattedData = data.map((value) => {
            return {
              ...value,
              config: {
                footer: "Btn",
                icon: "users",
                className: "primary btn-sm",
                label: "Lihat Semua Anggota",
                page: "show",
              },
              data: {
                id: value.Key,
                title: value["Nama Kelompok Keahlian"],
                prodi: { key: value["Kode Prodi"], nama: value.Prodi },
                pic: { key: value["Kode Karyawan"], nama: value.PIC },
                desc: value.Deskripsi,
                status: value.Status,
                members: value.Members || [],
                memberCount: value.Count || 0,
              },
            };
          });
          setCurrentData(formattedData);
        }
      })
      .then(() => setIsLoading(false));
  }, [currentFilter]);

  return (
    <>
      <div className="d-flex flex-column">
        <div className="flex-fill">
          <div className="input-group">
            <Button
              iconName="add"
              classType="success"
              label="Tambah"
              onClick={() => onChangePage("add")}
            />
            <Input
              ref={searchQuery}
              forInput="pencarianProduk"
              placeholder="Cari"
            />
            <Button
              iconName="search"
              classType="primary px-4"
              title="Cari"
              onClick={handleSearch}
            />
            <Filter>
              <DropDown
                ref={searchFilterSort}
                forInput="ddUrut"
                label="Urut Berdasarkan"
                type="none"
                arrData={dataFilterSort}
                defaultValue="[Nama Kelompok Keahlian] asc"
              />
              <DropDown
                ref={searchFilterStatus}
                forInput="ddStatus"
                label="Status"
                type="none"
                arrData={dataFilterStatus}
                defaultValue=""
              />
            </Filter>
          </div>
          <div className="container">
            <div className="row mt-3 gx-4">
              {!currentFilter.status ? (
                <div className="my-3">
                  <span class="badge fw-normal fs-6 text-dark-emphasis bg-primary-subtle">
                    <Icon name="arrow-down" /> Data Aktif / Menunggu PIC dari
                    Prodi
                  </span>
                </div>
              ) : (
                ""
              )}
              {currentData
                .filter((value) => {
                  return (
                    value.config.footer != "Draft" &&
                    value.config.footer != "Menunggu"
                  );
                })
                .map((value) => (
                  <CardKK
                    key={value.data.id}
                    config={value.config}
                    data={value.data}
                    onChangePage={onChangePage}
                  />
                ))}
              {currentData
                .filter((value) => {
                  return value.config.footer === "Menunggu";
                })
                .map((value) => (
                  <CardKK
                    key={value.data.id}
                    config={value.config}
                    data={value.data}
                    onChangePage={onChangePage}
                  />
                ))}

              {!currentFilter.status ? (
                <div className="my-3">
                  <span class="badge fw-normal fs-6 text-dark-emphasis bg-dark-subtle">
                    <Icon name="arrow-down" /> Data Draft / Belum dikirimkan ke
                    Prodi / Belum dipublikasi
                  </span>
                </div>
              ) : (
                ""
              )}
              {currentData
                .filter((value) => {
                  return value.config.footer === "Draft";
                })
                .map((value) => (
                  <CardKK
                    key={value.data.id}
                    config={value.config}
                    data={value.data}
                    onChangePage={onChangePage}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
