import { useEffect, useRef, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser } from "@fortawesome/free-solid-svg-icons";
// import Image from "../../../assets/images.jpg";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Table from "../../part/Table";
import Paging from "../../part/Paging";
import axios from "axios";
import Filter from "../../part/Filter";
import DropDown from "../../part/Dropdown";
import Alert from "../../part/Alert";
import Icon from "../../part/Icon";
import Loading from "../../part/Loading";
import CardPustaka from "../../part/CardPustaka";
import { API_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";

const inisialisasiData = [
    {
        Key: null,
        No: null,
        "Kelompok Keahlian": null,
        Judul: null,
        File: null,
        Keterangan: null,
        "Kata Kunci": null,
        Gambar: null,
        Status: "Aktif",
        Count: 0,
    },
];

export default function MasterDaftarPustakaIndex({ onChangePage, withID, withMenu }) {
    // console.log("ID: "+withID);
    const buttonLabel = withMenu === "kelola" ? "Tambah" : "Kelola";
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
        status: "Aktif",
        judul: "Judul",
        sort: "",
      });

    const dataFilterSort = [
        { Value: "[Judul] asc", Text: "Judul Pustaka [↑]" },
        { Value: "[Judul] desc", Text: "Judul Pustaka [↓]" },
    ];

    const dataFilterKeke = [
        { Value: "Pemrograman", Text: "Pemrograman" },
        { Value: "Data Analyst", Text: "Data Analyst" },
        { Value: "Perangkat Lunak", Text: "Perangkat Lunak" },
        { Value: "Lainnya", Text: "Lainnya" },
    ];

    const dataFilterStatus = [
        { Value: "Aktif", Text: "Aktif" },
        { Value: "Tidak Aktif", Text: "Tidak Aktif" },
    ];

    function handleSearch() {
        setIsLoading(true);
        setCurrentFilter((prevFilter) => {
            return {
                prevFilter,
                page: 1,
                query: searchQuery.current.value,
                sort: searchFilterSort.current.value,
                status: searchFilterStatus.current.value,
            };
        });
    }

    const handleAddClick = () => {
        if (withMenu === "kelola") {
          onChangePage("add","",withID);
        } else {
          onChangePage("indexKK");
        }
      };

    useEffect(() => {
        const fetchData = async () => {
          setIsError(false);
    
        //   console.log("Filter : "+JSON.stringify(currentFilter));
          try {
            const data = await UseFetch(
              API_LINK + "Pustakas/GetDataPustaka",
              currentFilter
            );
            // console.log(data);
    
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
                {/* Tombol Tambah */}
                <div className="flex-fill">
                    <div className="input-group">
                        <Button
                            iconName="add"
                            classType="success"
                            label={buttonLabel}
                            onClick={handleAddClick}
                        />
                        <Input
                            ref={searchQuery}
                            forInput="pencarianAlatMesin"
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
                                defaultValue="[Nama Alat/Mesin] asc"
                            />
                            <DropDown
                                ref={searchFilterJenis}
                                forInput="ddJenis"
                                label="Kelompok Keahlian"
                                type="semua"
                                arrData={dataFilterKeke}
                                defaultValue=""
                            />
                            <DropDown
                                ref={searchFilterStatus}
                                forInput="ddStatus"
                                label="Status"
                                type="none"
                                arrData={dataFilterStatus}
                                defaultValue="Aktif"
                            />
                        </Filter>
                    </div>
                    {/* Mapping data buku untuk membuat komponen Card */}
                    <CardPustaka
                        pustakas={currentData}
                        menu={withMenu}
                        filter={""}
                        onDetail={onChangePage}
                        onEdit={onChangePage}
                        uploader={"Muhammad Fatih"}
                    />
                </div>
            </div>
        </>
    );
}
