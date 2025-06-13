import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    // Формируем запрос с фильтрами
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
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value="Полный рабочий день"
                onChange={() =>
                  handleCheckboxChange(
                    "Полный рабочий день",
                    selectedWorkTimes,
                    setSelectedWorkTimes
                  )
                }
                checked={selectedWorkTimes.includes("Полный рабочий день")}
              />
              <label className="form-check-label">Полный рабочий день</label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value="Гибкий график"
                onChange={() =>
                  handleCheckboxChange(
                    "Гибкий график",
                    selectedWorkTimes,
                    setSelectedWorkTimes
                  )
                }
                checked={selectedWorkTimes.includes("Гибкий график")}
              />
              <label className="form-check-label">Гибкий график</label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value="По выходным"
                onChange={() =>
                  handleCheckboxChange(
                    "По выходным",
                    selectedWorkTimes,
                    setSelectedWorkTimes
                  )
                }
                checked={selectedWorkTimes.includes("По выходным")}
              />
              <label className="form-check-label">По выходным</label>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Тип занятости:</label>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value="Работа"
                onChange={() =>
                  handleCheckboxChange(
                    "Работа",
                    selectedWorkTypes,
                    setSelectedWorkTypes
                  )
                }
                checked={selectedWorkTypes.includes("Работа")}
              />
              <label className="form-check-label">Работа</label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value="Практика"
                onChange={() =>
                  handleCheckboxChange(
                    "Практика",
                    selectedWorkTypes,
                    setSelectedWorkTypes
                  )
                }
                checked={selectedWorkTypes.includes("Практика")}
              />
              <label className="form-check-label">Практика</label>
            </div>
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
        ) : vacancies.length === 0 ? (
          <p className="text-center">Вакансии не найдены.</p>
        ) : (
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
                        onClick={() => alert(`Отклик на вакансию: ${v.name}`)}
                      >
                        Откликнуться
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
