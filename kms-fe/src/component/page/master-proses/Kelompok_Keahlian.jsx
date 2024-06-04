import React, { useEffect, useState } from "react";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Filter from "../../part/Filter";
import DropDown from "../../part/Dropdown";
import Alert from "../../part/Alert";
import Loading from "../../part/Loading";
import Icon from "../../part/Icon";
import CardKK from "../../part/CardKelompokKeahlian";
import { API_LINK } from "../../util/Constants";

export default function SubKKIndex({ onChangePage }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [listKK, setListKK] = useState([]);

  const getKKAndPrograms = async () => {
    const username = "fadli.h";
    setIsError({ error: false, message: "" });
    setIsLoading(true);
  
    try {
      let kkData = await UseFetch(API_LINK + "Program/GetDataKKByPIC", { username });
      console.log("KK Data:", kkData);
  
      if (kkData === "ERROR") {
        throw new Error("Terjadi kesalahan: Gagal mengambil data Kelompok Keahlian.");
      }
  
      const kkWithPrograms = await Promise.all(
        kkData.map(async (kk) => {
          const programData = await UseFetch(API_LINK + "Program/GetProgramByKK", { kk: kk.Key });
          console.log("Program Data for KK:", kk.Key, programData);
  
          if (programData === "ERROR") {
            throw new Error("Terjadi kesalahan: Gagal mengambil data Program.");
          }

          // Jumlah Data Anggota
          const anggotaCountData = await UseFetch(API_LINK + "Program/CountAnggotaByKK", { p1: kk.Key });
          console.log("Anggota Count Data for KK:", kk.Key, anggotaCountData);
  
          if (anggotaCountData === "ERROR") {
            throw new Error("Terjadi kesalahan: Gagal menghitung jumlah anggota.");
          }

          const anggotaCount = anggotaCountData.length;
          console.log("Member Count for KK:", kk.Key, anggotaCount);

          // Jumlah Data Program
          const programCountData = await UseFetch(API_LINK + "Program/CountProgramByKK", { p1: kk.Key });
          console.log("Program Count Data for KK:", kk.Key, programCountData);
  
          if (programCountData === "ERROR") {
            throw new Error("Terjadi kesalahan: Gagal menghitung jumlah anggota.");
          }
  
          const programCount = programCountData.length;
          console.log("Program Count for KK:", kk.Key, programCount);
  
          const programsWithCategories = await Promise.all(
            programData.map(async (program) => {
              const categoryData = await UseFetch(API_LINK + "Program/GetKategoriByProgram", { p1: program.Key });
          
              // Count materials for each category (Asynchronous)
              const categoriesWithMaterialCounts = await Promise.all(
                categoryData.map(async (category) => {
                  const materialCountData = await UseFetch(API_LINK + "Program/CountMateriByKategori", { p1: category.Key });
                  return { ...category, materialCount: materialCountData.length };
                })
              );
          
              return { ...program, categories: categoriesWithMaterialCounts };
            })
          );

          return { ...kk, programs: programsWithCategories, AnggotaCount: anggotaCount,ProgramCount: programCount };
        })
      );
  
      console.log("KK with Programs:", kkWithPrograms);
      setListKK(kkWithPrograms);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e.message);
      setIsError({ error: true, message: e.message });
    }
  };
  
  useEffect(() => {
    getKKAndPrograms();
  }, []);

  return (
    <>
      {isLoading && <Loading />}
      {isError.error && <Alert type="danger" message={isError.message} />}
      <div className="d-flex flex-column">
        {/* <div className="flex-fill">
          <div className="input-group">
            <Input forInput="pencarianProduk" placeholder="Cari" />
            <Button iconName="search" classType="primary px-4" title="Search" />
          </div>
        </div> */}
        <div className="flex-fill d-flex flex-wrap justify-content-center align-items-center">
          {listKK.map((kk, index) => (
            <CardKK key={index} kk={kk} onChangePage={onChangePage} />
          ))}
        </div>
      </div>
    </>
  );
}
