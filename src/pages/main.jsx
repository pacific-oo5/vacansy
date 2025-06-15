import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Main = ({ vacancies, loading, onFilterUpdate }) => {
  const navigate = useNavigate();

  const [showSidebar, setShowSidebar] = useState(false);
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [selectedWorkTimes, setSelectedWorkTimes] = useState([]);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState([]);

  const handleCheckboxChange = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const handleFilter = async (e) => {
    e.preventDefault();

    const from = salaryFrom || 0;
    const to = salaryTo || 1000000;

    const workTimeParams = selectedWorkTimes
      .map((t) => `work_time=${encodeURIComponent(t)}`)
      .join("&");
    const workTypeParams = selectedWorkTypes
      .map((t) => `work_type=${encodeURIComponent(t)}`)
      .join("&");

    let query = `?salary__gte=${from}&salary__lte=${to}`;
    if (workTimeParams) query += `&${workTimeParams}`;
    if (workTypeParams) query += `&${workTypeParams}`;

    if (onFilterUpdate) {
      await onFilterUpdate(query);
    }

    setShowSidebar(false);
  };

  return (
    <div className="container-fluid">
      <button
        className="btn btn-outline-primary m-3"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        ☰ Фильтр
      </button>

      {/* Сайдбар фильтров */}
      <div
        className={`position-fixed top-0 start-0 bg-light h-100 p-4 shadow ${
          showSidebar ? "d-block" : "d-none"
        }`}
        style={{ width: "300px", zIndex: 1050 }}
      >
        <h5>Фильтрация</h5>
        <form onSubmit={handleFilter}>
          <div className="mb-3">
            <label className="form-label">Зарплата от:</label>
            <input
              type="number"
              className="form-control"
              value={salaryFrom}
              onChange={(e) => setSalaryFrom(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Зарплата до:</label>
            <input
              type="number"
              className="form-control"
              value={salaryTo}
              onChange={(e) => setSalaryTo(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">График работы:</label>
            {["Полный рабочий день", "Гибкий график", "По выходным"].map((time) => (
              <div className="form-check" key={time}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={time}
                  onChange={() =>
                    handleCheckboxChange(time, selectedWorkTimes, setSelectedWorkTimes)
                  }
                  checked={selectedWorkTimes.includes(time)}
                />
                <label className="form-check-label">{time}</label>
              </div>
            ))}
          </div>

          <div className="mb-3">
            <label className="form-label">Тип занятости:</label>
            {["Работа", "Практика"].map((type) => (
              <div className="form-check" key={type}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={type}
                  onChange={() =>
                    handleCheckboxChange(type, selectedWorkTypes, setSelectedWorkTypes)
                  }
                  checked={selectedWorkTypes.includes(type)}
                />
                <label className="form-check-label">{type}</label>
              </div>
            ))}
          </div>

          <button className="btn btn-primary w-100 mt-3" type="submit">
            Применить фильтр
          </button>
          <button
            type="button"
            className="btn btn-secondary w-100 mt-2"
            onClick={() => setShowSidebar(false)}
          >
            Закрыть
          </button>
        </form>
      </div>

      {/* Список вакансий */}
      <div
        className="container my-5"
        style={{ marginLeft: showSidebar ? "310px" : "0" }}
      >
        <h2 className="mb-4 text-center">Вакансии</h2>

        {loading ? (
          <p className="text-center">Загрузка...</p>
        ) : Array.isArray(vacancies) && vacancies.length === 0 ? (
          <p className="text-center">Вакансии не найдены.</p>
        ) : Array.isArray(vacancies) ? (
          <div className="row g-4">
            {vacancies.map((v) => (
              <div key={v.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{v.name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      График: {v.work_time}
                    </h6>
                    <p className="card-text flex-grow-1">
                      {v.description
                        ? v.description.slice(0, 100) + "..."
                        : "Описание отсутствует"}
                    </p>
                    <div className="mt-auto d-flex justify-content-between">
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/desc/${v.id}`)}
                      >
                        Узнать больше
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem("token");
                            if (!token) {
                              alert("Пожалуйста, войдите в аккаунт");
                              return;
                            }

                            await axios.post(
                              `https://quality-herring-fine.ngrok-free.app/api/vacancies/${v.id}/respond/`,
                              {},
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                            );
                            alert("Отклик успешно отправлен!");
                          } catch (err) {
                            console.error(err);
                            alert(
                              "Ошибка при отклике: " +
                                (err.response?.data?.detail || "Неизвестная ошибка")
                            );
                          }
                        }}
                      >
                        Откликнуться
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-danger">
            Ошибка: вакансии не в виде массива.
          </p>
        )}
      </div>
    </div>
  );
};

export default Main;
