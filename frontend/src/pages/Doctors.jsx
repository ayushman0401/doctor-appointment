import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoctor, setFilterDoctor] = useState([]);
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);

  const { doctors } = useContext(AppContext);
  const applyFilter = () => {
    if (speciality) {
      setFilterDoctor(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoctor(doctors); //undefined as no param in speciality
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div>
      <p className="text-gray-600 ">browse through the doctors specialist.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-primary text-white" : ""
          } `}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>
        <div
          className={` flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? "flex" : "hidden sm:flex"
          }`}
        >
          <p
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-100 rounded transition-all cursor-pointer ${
              speciality === "General physician"
                ? "bg-indigo-50 text-black"
                : ""
            }`}
            onClick={() =>
              speciality === "General physician"
                ? navigate("/doctors/")
                : navigate("/doctors/General physician")
            }
          >
            General physician
          </p>
          <p
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-100 rounded transition-all cursor-pointer ${
              speciality === "Gynecologist" ? "bg-indigo-50 text-black" : ""
            }`}
            onClick={() =>
              speciality === "Gynecologist"
                ? navigate("/doctors/")
                : navigate("/doctors/Gynecologist")
            }
          >
            Gynecologist
          </p>
          <p
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-100 rounded transition-all cursor-pointer ${
              speciality === "Dermatologist" ? "bg-indigo-50 text-black" : ""
            }`}
            onClick={() =>
              speciality === "Dermatologist"
                ? navigate("/doctors/")
                : navigate("/doctors/Dermatologist")
            }
          >
            Dermatologist
          </p>
          <p
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-100 rounded transition-all cursor-pointer ${
              speciality === "Pediatricians" ? "bg-indigo-50 text-black" : ""
            }`}
            onClick={() =>
              speciality === "Pediatricians"
                ? navigate("/doctors/")
                : navigate("/doctors/Pediatricians")
            }
          >
            Pediatricians
          </p>
          <p
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-100 rounded transition-all cursor-pointer ${
              speciality === "Neurologist" ? "bg-indigo-50 text-black" : ""
            }`}
            onClick={() =>
              speciality === "Neurologist"
                ? navigate("/doctors/")
                : navigate("/doctors/Neurologist")
            }
          >
            Neurologist
          </p>
          <p
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-100 rounded transition-all cursor-pointer ${
              speciality === "Gastroenterologist"
                ? "bg-indigo-50 text-black"
                : ""
            }`}
            onClick={() =>
              speciality === "Gastroenterologist"
                ? navigate("/doctors/")
                : navigate("/doctors/Gastroenterologist")
            }
          >
            Gastroenterologist
          </p>
        </div>
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6 ">
          {filterDoctor.map((item, index) => (
            <div
              onClick={() => navigate(`/appointment/${item._id}`)}
              key={index}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            >
              <img className="bg-blue-50" src={item.image} alt="" />
              <div className="p-4">
                <div
                  className={`flex items-center gap-2 text-sm text-center ${
                    item.available ? "text-green-500" : "text-red-400"
                  }`}
                >
                  <p
                    className={`w-2 h-2 ${
                      item.available ? "bg-green-500" : "bg-red-400"
                    } rounded-full`}
                  ></p>
                  {<p>{item.available ? "Available" : "Not Available"}</p>}
                </div>
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
