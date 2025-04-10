"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function SignUp() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    subscribeNewsletter: false,
  })

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success", 
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      subscribeNewsletter: e.target.checked,
    }))
  }

  const showAlert = (message, type = "error") => {
    setAlert({
      show: true,
      message,
      type,
    })

    
    setTimeout(() => {
      setAlert((prev) => ({ ...prev, show: false }))
    }, 5000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      showAlert("A jelszavak nem egyeznek!")
      return
    }

    try {
      const response = await fetch("http://localhost:3000/user/adduser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          jelszo: formData.password,
          felhasznalonev: formData.username,
          hirlevel: formData.subscribeNewsletter,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        showAlert("Sikeres regisztráció!", "success")
        
        
        try {
          const emailResponse = await fetch("http://localhost:3000/email/registration-confirmation", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formData.email,
              username: formData.username
            }),
          });
          
          if (emailResponse.ok) {
          } else {
          }
        } catch (emailError) {
        }

        
        setTimeout(() => navigate("/login"), 1500)
      } else {
        showAlert(`Hiba: ${data.message}`)
      }
    } catch (error) {
      showAlert("Hálózati hiba történt.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-red-700 text-white py-4 px-6">
          <h1 className="text-2xl font-bold">Regisztráció</h1>
        </div>

        {alert.show && (
          <div
            className={`p-4 mb-4 mx-6 mt-6 rounded-md ${
              alert.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            } flex justify-between items-center`}
          >
            <p>{alert.message}</p>
            <button
              onClick={() => setAlert((prev) => ({ ...prev, show: false }))}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="text-gray-700 block">
              Felhasználónév
            </label>
            <input
              id="username"
              name="username"
              placeholder="Felhasználónév"
              value={formData.username}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-gray-700 block">
              Email cím
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="pelda@email.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-gray-700 block">
              Jelszó
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-gray-700 block">
              Jelszó megerősítése
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="subscribeNewsletter"
              checked={formData.subscribeNewsletter}
              onChange={handleCheckboxChange}
              className="w-4 h-4"
            />
            <label
              htmlFor="subscribeNewsletter"
              className="text-sm text-gray-600"
            >
              Feliratkozom a hírlevélre
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-800"
          >
            Regisztráció
          </button>

          <div className="text-center text-gray-600 text-sm">
            Már van fiókod?{" "}
            <a href="/login" className="text-red-700 hover:underline font-medium">
              Jelentkezz be
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
