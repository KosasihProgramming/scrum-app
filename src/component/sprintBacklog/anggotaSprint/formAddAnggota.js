import React, { useState } from "react";
import "dayjs/locale/id";
import "dayjs/locale/id";
import { MdOutlineSave } from "react-icons/md";

import { MdDeleteOutline } from "react-icons/md";
import DropdownSearch from "../../features/dropdown";
function FormAddAnggota(props) {
  const [user, setUser] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();

    props.addData(user);
  };

  console.log(props.data);
  return (
    <div>
      <div
        className={`p-6 duration-500 flex w-full flex-col justify-between items-start px-2 mt-5 bg-white rounded-xl shadow-md `}
      >
        <div
          className={`flex w-full flex-col justify-start items-start rounded-xl mb-2  `}
        >
          <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 px-4 gap-4 ">
            <h4 className="font-semibold text-sm">User</h4>

            <div className="w-full flex z-[999] justify-start gap-3 items-center p-1 border border-blue-600 rounded-xl">
              <div className="flex items-center justify-center z-[999] w-[100%]">
                <DropdownSearch
                  options={props.optionUser}
                  change={(item) => {
                    setUser(item);
                  }}
                  name={"User"}
                  isSearch={false}
                />
              </div>
            </div>
            <button class="button-insert mt-5" onClick={handleAdd}>
              Simpan Data
              <MdOutlineSave className="text-white text-xl" />
            </button>
          </div>

          <div className="w-[100%] gap-2 flex  justify-between items-center py-2 px-4 gap-4  ">
            <h4 className="text-base font-medium text-blue-600 ">
              List Anggota
            </h4>
          </div>

          <div
            data-aos="fade-up"
            className="w-[100%] h-[20rem] gap-2 flex flex-col  justify-start items-center py-2 px-4 gap-4 overflow-y-scroll "
          >
            {props.data.map((data) => (
              <>
                <div className="w-full py-2 px-4 flex justify-start rounded-xl shadow-md border border-blue-600 gap-6">
                  <img
                    className="w-[2.8rem] h-[2.8rem] rounded-full flex justify-center items-center object-cover "
                    src={
                      data.userDetails.Foto.length > 0
                        ? data.userDetails.Foto[0].url
                        : "https://pbs.twimg.com/media/GIXGMewbEAAcI5p?format=jpg&name=small"
                    }
                  />
                  <div className="flex w-full justify-between  items-center gap-2 ">
                    <div className="flex justify-between flex-col items-start gap-2 ">
                      <h4 className="font-semibold text-sm">{data.value}</h4>
                      <div className="flex justify-start items-center gap-6">
                        <p className="text-xs font-normal ">
                          {data.userDetails.email}
                        </p>
                      </div>
                    </div>
                    <div class="group relative">
                      <button
                        onClick={() => props.delete(data.id)}
                        className="w-[2.5rem] h-[2.5rem] duration-300 transition-all flex justify-center items-center rounded-full border hover:border-red-600 hover:scale-125 bg-red-100 "
                      >
                        <MdDeleteOutline class="text-lg  duration-200 text-red-700" />
                      </button>
                      <span
                        class="absolute -top-10 left-[50%] -translate-x-[50%] 
  z-20 origin-left scale-0 px-3 rounded-lg border 
  border-gray-300 bg-red-600 text-white py-2 text-xs font-semibold
  shadow-md transition-all duration-300 ease-in-out 
  group-hover:scale-100"
                      >
                        Hapus<span></span>
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormAddAnggota;
