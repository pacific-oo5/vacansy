import React, { useState } from 'react';
import axios from 'axios';

const CreateVacancy = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    about_me: '',
    work_type: 'Работа',
    work_time: 'Гибкий график',
    salary: 0,
    location: '',
    is_remote: false,
    requirements: '',
    responsibilities: '',
    is_active: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const createVacancy = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'https://quality-herring-fine.ngrok-free.app/api/vacancies/create/',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Вакансия создана');
    } catch (err) {
      console.error(err);
      alert('Ошибка создания');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Создать вакансию</h2>
      <div className="row g-3">
        <div className="col-md-6">
          <input
            className="form-control"
            name="name"
            placeholder="Название"
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <input
            className="form-control"
            name="description"
            placeholder="Описание"
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <input
            className="form-control"
            name="about_me"
            placeholder="О себе"
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <select className="form-select" name="work_type" onChange={handleChange}>
            <option value="Работа">Работа</option>
            <option value="Практика">Практика</option>
          </select>
        </div>
        <div className="col-md-6">
          <select className="form-select" name="work_time" onChange={handleChange}>
            <option value="Гибкий график">Гибкий график</option>
            <option value="Польный рабочий день">Польный рабочий день</option>
            <option value="По выходным">По выходным</option>
          </select>
        </div>
        <div className="col-md-6">
          <input
            className="form-control"
            name="salary"
            type="number"
            placeholder="Зарплата"
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <input
            className="form-control"
            name="location"
            placeholder="Локация"
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6 form-check form-switch d-flex align-items-center mt-2">
          <input
            className="form-check-input me-2"
            name="is_remote"
            type="checkbox"
            onChange={handleChange}
            id="remoteCheck"
          />
          <label className="form-check-label" htmlFor="remoteCheck">
            Удаленно
          </label>
        </div>
        <div className="col-md-12">
          <textarea
            className="form-control"
            name="requirements"
            placeholder="Требования"
            rows="3"
            onChange={handleChange}
          />
        </div>
        <div className="col-md-12">
          <textarea
            className="form-control"
            name="responsibilities"
            placeholder="Обязанности"
            rows="3"
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6 form-check form-switch d-flex align-items-center mt-2">
          <input
            className="form-check-input me-2"
            name="is_active"
            type="checkbox"
            checked={form.is_active}
            onChange={handleChange}
            id="activeCheck"
          />
          <label className="form-check-label" htmlFor="activeCheck">
            Активна
          </label>
        </div>
        <div className="col-12">
          <button className="btn btn-primary w-100" onClick={createVacancy}>
            Создать
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateVacancy;
