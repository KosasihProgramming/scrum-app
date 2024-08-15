import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import FormEditSprint from "./formEditSprint.js";

export default function ModalEditSprint(props) {
  const setOpen = () => {
    props.setOpen(false);
  };

  const handleAdd = (
    tim,
    status,
    urutan,
    tanggalMulai,
    tanggalBerakhir,
    product
  ) => {
    props.editData(tim, status, urutan, tanggalMulai, tanggalBerakhir, product);
  };
  return (
    <Dialog open={props.open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-full overflow-y-auto  flex justify-center items-center pl-48">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg w-[45rem]  text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-slate-100  pb-8  w-[45rem]">
              <div className="flex items-start">
                <div className=" text-center w-full  ">
                  <div className=" w-full flex justify-center">
                    <DialogTitle
                      as="h3"
                      className="text-xl font-semibold leading-6 text-white w-[95%]  py-3 mt-8 rounded-xl bg-blue-600 "
                    >
                      Update Data Sprint
                    </DialogTitle>
                  </div>
                  <div className=" px-4">
                    <FormEditSprint
                      data={props.data}
                      addData={handleAdd}
                      optionTim={props.optionTim}
                      optionProduct={props.optionProduct}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 flex justify-end w-full sm:px-6">
              <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className="mt-3 justify-center rounded-md bg-blue-100 border border-blue-600 text-blue-700 hover:border-white px-3 py-2 text-sm font-semibold w-[8rem] shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
