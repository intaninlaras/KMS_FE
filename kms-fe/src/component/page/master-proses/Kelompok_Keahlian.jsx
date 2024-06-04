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
import CardProgram from "../../part/CardProgram";
import CardKategoriProgram from "../../part/CardKategoriProgram";
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
  
      if (kkData === "ERROR") {
        throw new Error("Terjadi kesalahan: Gagal mengambil data Kelompok Keahlian.");
      }
  
      // Iterate over KK data and fetch programs for each KK
      const kkWithPrograms = await Promise.all(
        kkData.map(async (kk) => {
          const programData = await UseFetch(API_LINK + "Program/GetProgramByKK", { kk: kk.Key });
          if (programData === "ERROR") {
            throw new Error("Terjadi kesalahan: Gagal mengambil data Program.");
          }
  
          // Fetch categories for each program
          const programsWithCategories = await Promise.all(
            programData.map(async (program) => {
              const categoryData = await UseFetch(API_LINK + "Program/GetKategoriByProgram", { p1: program.Key });
              return { ...program, categories: categoryData };
            })
          );
  
          return { ...kk, programs: programsWithCategories }; // Include programs with categories in KK object
        })
      );
  
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
        <div className="flex-fill">
          <div className="input-group">
            <Input forInput="pencarianProduk" placeholder="Cari" />
            <Button iconName="search" classType="primary px-4" title="Cari" />
            <Filter>
              <DropDown forInput="ddUrut" label="Urut Berdasarkan" type="none" defaultValue="[Kode Produk] asc" />
              <DropDown forInput="ddJenis" label="Jenis Produk" type="semua" defaultValue="" />
              <DropDown forInput="ddStatus" label="Status" type="none" defaultValue="Aktif" />
            </Filter>
          </div>
          <div className="container">
            <div className="row mt-3 gx-4">
              {listKK.map((kk) => (
                <div key={kk.Key} className="col-md-12">
                  {/* Card untuk Kelompok Keahlian */}
                  <CardKK kk={kk} />
                  {/* Card untuk Program */}
                  {kk.programs.map((program) => (
                    <CardProgram key={program.Key} program={program} />
                  ))}
                  {/* Card untuk Kategori Program */}
                  {kk.programs.map((program) => (
                    program.categories.map((kategori) => (
                      <CardKategoriProgram 
                      key={kategori.Key} 
                      kategori={kategori} 
                      onChangePage={onChangePage}/>
                    ))
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}