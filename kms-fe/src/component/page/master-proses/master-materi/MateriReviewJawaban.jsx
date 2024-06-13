import { useEffect, useRef, useState } from "react";
import { PAGE_SIZE, API_LINK } from "../../../util/Constants";
import { formatDate, separator } from "../../../util/Formatting";
import UseFetch from "../../../util/UseFetch";
import Button from "../../../part/Button";
import Input from "../../../part/Input";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import Filter from "../../../part/Filter";
import DropDown from "../../../part/Dropdown";
import Alert from "../../../part/Alert";
import Loading from "../../../part/Loading";

const inisialisasiData = [
  {
    Key: null,
    No: null,
    "Nama Peserta": null,
    "Pertanyaan": null,
    "Jawaban": null,
    "Aksi": null,
    Count: 0,
  },
];

const dataFilterSort = [
  { Value: "[Nama Peserta] asc", Text: "Nama Peserta [↑]" },
  { Value: "[Nama Peserta] desc", Text: "Nama Peserta [↓]" },
];

export default function MasterKursProsesIndex({ onChangePage }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "[Nama Peserta] asc",
  });

  const searchQuery = useRef();
  const searchFilterSort = useRef();

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
      };
    });
  }

  useEffect(() => {
    setIsError(false);
    UseFetch(API_LINK + "MasterKursProses/GetDataKursProses", currentFilter)
      .then((data) => {
        if (data === "ERROR") setIsError(true);
        else if (data.length === 0) setCurrentData(inisialisasiData);
        else {
          const formattedData = data.map((value) => {
            return {
              ...value,
              "Tanggal Mulai Berlaku": formatDate(
                value["Tanggal Mulai Berlaku"]
              ),
              "Harga (Rp.)": separator(value["Harga (Rp.)"]),
              Aksi: ["Detail"],
              Alignment: ["center", "left", "right", "center", "center"],
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
        {isError && (
          <div className="flex-fill">
            <Alert
              type="warning"
              message="Terjadi kesalahan: Gagal mengambil data Peserta."
            />
          </div>
        )}
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
              forInput="pencarianKursProses"
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
                defaultValue="[Nama Peserta] asc"
              />
            </Filter>
          </div>
        </div>
        <div className="mt-3">
          {isLoading ? (
            <Loading />
          ) : (
            <div className="d-flex flex-column">
              <Table data={currentData} onDetail={onChangePage} />
              <Paging
                pageSize={PAGE_SIZE}
                pageCurrent={currentFilter.page}
                totalData={currentData[0]["Count"]}
                navigation={handleSetCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
