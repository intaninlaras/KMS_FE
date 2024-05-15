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
import { API_LINK } from "../../util/Constants";

const inisialisasiData = [
  {
    Key: null,
    No: null,
    "Nama Kelompok Keahlian": null,
    PIC: null,
    Deskripsi: null,
    Status: null,
    Count: 0,
  },
];

export default function KelolaPustakaIndex({ onChangePage }) {
  const [isLoading, setIsLoading] = useState(true);
  const searchQuery = useRef();
  const searchFilterSort = useRef();
  const searchFilterStatus = useRef();
  const searchFilterJenis = useRef();
  const [isError, setIsError] = useState(false);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [listPustaka, setListPustaka] = useState([]);
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    nama: "[Nama Kelompok Keahlian] ASC",
    status: "Aktif",
  });

  const keahlian = [
    {
      kke_id: 1,
      kke_nama: "Programming Java",
      pro_id: "Manajemen Informatika",
      kry_id: "Revalina Fitriani",
      kke_deskripsi: "Manajemen Informatika adalah ilmu yang mempelajari teori-teori dalam teknologi informasi serta penggunaannya dalam membuat bisnis perusahaan menjadi lebih mudah.",
      kke_status: "Aktif",
    },
    {
      kke_id: 2,
      kke_nama: "Data Analyst",
      pro_id: "Teknik Rekayasa Perangkat Lunak",
      kry_id: "Revalina Fitriani",
      kke_deskripsi: "RPL (Rekayasa Perangkat Lunak) adalah sebuah jurusan yang mempelajari dan mendalami semua cara-cara pengembangan perangkat lunak termasuk pembuatan, pemeliharaan, manajemen organisasi pengembangan perangkat lunak dan manajemen kualitas.",
      kke_status: "Aktif",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);

      console.log("Filter : " + JSON.stringify(currentFilter));
      try {
        const data = await UseFetch(
          API_LINK + "KKs/GetDataKK",
          currentFilter
        );
        console.log(data);

        if (data === "ERROR") {
          setIsError(true);
        } else if (data.length === 0) {
          setCurrentData(inisialisasiData);
        } else {
          const formattedData = data.map((value) => ({
            ...value,
            Aksi: ["Toggle", "Detail", "Edit"],
            Alignment: ["center", "left", "center", "center"],
          }));
          setCurrentData(formattedData);
          console.log(JSON.stringify(currentData));
        }
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentFilter]);

  return (
    <>
      <div className="d-flex flex-column">
        <div className="flex-fill">
          <div className="input-group">
            {/* <Button
              iconName="add"
              classType="success"
              label="Tambah"
              onClick={() => onChangePage("add")}
            /> */}
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
              <CardKK
                type="active"
                title="Programming Java"
                prodi="Manajemen Informatika"
                desc="Manajemen Informatika adalah ilmu yang mempelajari teori-teori dalam teknologi informasi serta penggunaannya dalam membuat bisnis perusahaan menjadi lebih mudah."
                checked={true}
                onChangePage={onChangePage}
                relatedPerson={[]}
                keahlian={currentData}
                personCount="5"
              ></CardKK>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
