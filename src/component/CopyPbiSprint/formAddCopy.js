import React, { useState } from "react";
import "dayjs/locale/id";
import "dayjs/locale/id";
import { MdOutlineSave } from "react-icons/md";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import DropdownSearch from "../features/dropdown";
import { Link } from "react-router-dom";
function FormAddCopyPbiSprint(props) {
  const [sprint, setSprint] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();

    props.addData(sprint);
  };

  return (
    <div>
      <div
        className={`p-6 duration-500 flex w-full flex-col justify-between items-start px-2 mt-5 bg-white rounded-xl shadow-md `}
      >
        <div
          className={`flex w-full flex-col justify-start items-start rounded-xl mb-2  `}
        >
          <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 px-4 gap-4 ">
            <h4 className="font-semibold text-sm">
              Pilih Sprint Backlog Tujuan
            </h4>
            {props.open == true && (
              <>
                <div className="w-full flex z-[999] justify-start gap-3 items-center p-1 border border-blue-600 rounded-xl">
                  <div className="flex items-center justify-center z-[999] w-[100%]">
                    <DropdownSearch
                      options={props.dataSprint}
                      change={(item) => {
                        setSprint(item);
                      }}
                      name={"Sprint Backlog"}
                      isSearch={false}
                    />
                  </div>
                </div>
              </>
            )}
            <button class="button-insert mt-5" onClick={handleAdd}>
              Simpan Data
              <MdOutlineSave className="text-white text-xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormAddCopyPbiSprint;
