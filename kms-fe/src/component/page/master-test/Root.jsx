import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import KMS_Rightbar from "../../backbone/KMS_RightBar";
import MasterTestIndex from "./Index";
import MasterTestPostTest from "./PostTest";
import MasterTestPreTest from "./PreTest";
import MasterTestPengerjaanTest from "./Test";
import MasterTestHasilTest from "./HasilTest";
import MasterTestDetailTest from "./DetailTest";
import MasterTestForum from "./Forum";
import MasterTestMateriPDF from "./MateriPDF";
import MasterTestMateriVideo from "./MateriVideo";

export default function MasterTest() {
  
  const [pageMode, setPageMode] = useState("index");

  const [isDataReady, setIsDataReady] = useState(false); 
  const [materiId, setMateriId] = useState("");
  const [quizType, setQuizType] = useState("");

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterTestIndex onChangePage={handleSetPageMode} />;
      case "pretest":
        return (
          <MasterTestPreTest
            onChangePage={handleSetPageMode}
            CheckDataReady={isDataReady}
            materiId={materiId}
          />
        );
      case "posttest":
          return <MasterTestPostTest onChangePage={handleSetPageMode} />;
      case "pengerjaantest":
        return <MasterTestPengerjaanTest 
          onChangePage={handleSetPageMode} 
          quizType={quizType}
        />;
      case "detailtest":
        return <MasterTestDetailTest onChangePage={handleSetPageMode} />;
        // withQuizId={quizId} 
      case "hasiltest":
        return (
          <MasterTestHasilTest
            onChangePage={handleSetPageMode}
            CheckDataReady={isDataReady}
            materiId={materiId}
          />
        );
      case "forum":
        return <MasterTestForum onChangePage={handleSetPageMode} />;
      case "materipdf":
        return <MasterTestMateriPDF onChangePage={handleSetPageMode} />;
      case "materivideo":
        return <MasterTestMateriVideo onChangePage={handleSetPageMode} />;
    }
  }
  function handleSetPageMode(mode) {
    setPageMode(mode);
  }

  function handleSetPageMode(newPageMode, key = "") {
    setPageMode(newPageMode);
    setMateriId(key);
  }

  function handleSetPageMode(newPageMode, type = "") {
    setPageMode(newPageMode);
    setQuizType(type);
  }

  function handleSetPageMode(newPageMode, dataReady = false, key = "") {
    setPageMode(newPageMode);
    setIsDataReady(dataReady);
    setMateriId(key);
    
  }

  return <div>{getPageMode()}</div> 
}
