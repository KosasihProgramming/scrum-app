import React, { useState } from "react";
import "../../styles/button.css";
import Filter from "../features/filter";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import HeroArea from "../features/wave";
import { AnimatePresence, motion } from "framer-motion";
import Aos from "aos";

function Login() {
  const [email, setEmail] = useState("");
  const [isLogin, setisLogin] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Inisialisasi useNavigate

  const handleLogin = async (e) => {
    // e.preventDefault(); // Mencegah submit form secara default

    if (email === "" || password === "") {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Harap Isi Email dan Password",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    try {
      const filters = [
        {
          type: "equal",
          field: "Email",
          value: `${email}`,
        },
        {
          type: "equal",
          field: "Password",
          value: `${password}`,
        },
      ];
      const param = await Filter(filters);
      const response = await axios({
        method: "GET",
        url:
          "http://202.157.189.177:8080/api/database/rows/table/717/?" + param,
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
        },
      });
      console.log(response.data.results, "all data Dod");
      const allData = response.data.results;

      if (allData.length > 0) {
        sessionStorage.setItem("isLoggedIn", true);
        sessionStorage.setItem("userEmail", email);
        sessionStorage.setItem("peran", allData[0].Peran[0].value);
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Selamat, Anda Berhasil Masuk",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Gagal",
          text: "Gagal Masuk, Periksa kembali Email dan Password Anda",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      return allData;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal Masuk, Terdapat Error Sistem " + error,
        showConfirmButton: false,
        timer: 1500,
      });
      alert(error.message);
    }
  };
  const sendMessage = async () => {
    const text = `User dengan Email <b>${email}</b>, Lupa Password, Dia Minta Password Ke Elu. `;
    try {
      const response = await fetch(
        "https://api.telegram.org/bot7140283752:AAEUOiJb7eO3c_UyLWCyn5-HWb7IeTgSKeY/sendMessage",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: "6546310886",
            text: text,
            parse_mode: "html",
          }),
        }
      );

      if (response.ok) {
        console.log("Berhasil Dikirmkan");
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Permintaan Password Telah Dikirimkan Ke Sir Dzulfi, Mohon Tunggu Jawabannya dari Beliau",
          showConfirmButton: true,
        });
      } else {
        console.log("Gagal mengirim pesan");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-700 relative">
      <div
        data-aos="fade-up"
        className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg absolute z-[99]"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600">
          Scrum App
        </h2>
        {isLogin == false ? (
          <>
            <p className="text-center text-gray-600">Welcome to Scrum App</p>
          </>
        ) : (
          <>
            <p className="text-center text-gray-600">
              Kirim Permintaan Password
            </p>
          </>
        )}
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm">
            <div>
              <h4 className="sr-only">Email</h4>
              <input
                name="email"
                type="email"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-gray-100 border border-gray-300 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            {isLogin == false && (
              <>
                <div className="mt-2">
                  <h4 className="sr-only">Password</h4>
                  <input
                    name="password"
                    type="password"
                    required
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-gray-100 border border-gray-300 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex items-center justify-between">
            {isLogin == false ? (
              <>
                <div className="text-sm">
                  <button
                    onClick={() => {
                      setisLogin(true);
                    }}
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-sm">
                  <button
                    onClick={() => {
                      setisLogin(false);
                    }}
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign In Again
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="w-full flex justify-center">
            {isLogin == false ? (
              <>
                <button
                  className="button-login"
                  alt="Sign In"
                  onClick={handleLogin}
                >
                  <i>S</i>
                  <i>i</i>
                  <i>g</i>
                  <i>n</i>
                  <i>&nbsp;</i>
                  <i>I</i>
                  <i>n</i>
                </button>
              </>
            ) : (
              <>
                <button className="button-forget" onClick={sendMessage}>
                  <div class="svg-wrapper-1-forget">
                    <div class="svg-wrapper">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path
                          fill="currentColor"
                          d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <span>Kirim</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <HeroArea />
    </div>
  );
}

export default Login;
