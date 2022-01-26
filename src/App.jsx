import React, { useEffect, useState } from "react";
import moment from "moment";

import axiosClient   from "./helpers/axiosClient";
import isValidaArray from "./helpers/isValidArray";
import "moment/locale/es";
import "./app.css";

moment.locale("es");

const App = () => {
  
  const [days, setDays] = useState(null);
  const [week, setWeek] = useState(1);
  const [weekNumber, setWeekNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleNext = () => {
    setWeek(prevState => (prevState + 1))
    setIsLoading(true);
  }

  const handlePrev = () => {
    setWeek(prevState => (prevState - 1))
  }

  useEffect(() => {
    const changeWeek = async() => {
      
      try {
        const { data: { success, dayOfWeek, weekQuery } } = await axiosClient.post(`/weekly?week=${week}`);
        
        if(success) {
          setIsLoading(false)
          setDays(dayOfWeek)
          setWeekNumber(weekQuery)
        }
  
      } catch (error) {
        console.log("[changeWeek]", error);
      }
    }

    if(days !== null) {
      changeWeek();
    }

  }, [week]);

  const setDate = async() => {
    setIsLoading(true)
    try {
      await axiosClient.post("/save-weekly");
      const { data: { success, dayOfWeek, weekQuery } } = await axiosClient.post(`/weekly?week=${week}`);

      if(success) {
        setIsLoading(false)
        setDays(dayOfWeek)
        setWeekNumber(weekQuery)
      }

    } catch(error) {
      console.log("[setData]", error);
    }
  }

  return (
    <main className="app">

      <button type="button" onClick={setDate}>
        { isLoading ? "..." : "Consultar" }
      </button>
      { days ? <h1>Semana #{weekNumber}</h1> : null }
      <ul>
        {
          isValidaArray(days) ? days.map(day => (
            <li key={day}>{ moment(day).format("LL") }</li>
          )) : null
        }
      </ul>
      { days ?
        <div className="wrap-buttons">
          <button
            type="button"
            onClick={handlePrev}
            disabled={week <= 1}
          >
            { isLoading ? "..." : "Semana siguiente" }
          </button>
          <button
            type="button"
            onClick={handleNext}
          >
            { isLoading ? "..." : "Semana siguiente" }
          </button>
        </div> : null
      }
    </main>
  );
}

export default App;
