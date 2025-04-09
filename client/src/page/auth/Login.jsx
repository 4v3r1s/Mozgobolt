"use client"

import { useState } from "react"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [jelszo, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success", 
  })

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
    setError("")
  
    try {
      const response = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, jelszo }),
      })
  
      if (!response.ok) {
        throw new Error("Sikertelen bejelentkezés")
      }
  
      const data = await response.json()
      const token = data.token
  
      if (!token) {
        throw new Error("Token nem található")
      }
  
      
      document.cookie = `token=${token}; path=/; ${rememberMe ? "max-age=604800;" : ""}`
      
      
      localStorage.setItem('token', token)
      console.log("Token mentve a localStorage-ba:", token)
      
      
      try {
        const userResponse = await fetch("http://localhost:3000/user/profile", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (userResponse.ok) {
          const userData = await userResponse.json()
          localStorage.setItem('user', JSON.stringify(userData))
          console.log("Felhasználói adatok mentve:", userData)
        }
      } catch (userError) {
        console.error("Hiba a felhasználói adatok lekérésekor:", userError)
       
      }
  
      
      showAlert("Sikeres bejelentkezés!", "success")
  
      
      setTimeout(() => {
        window.location.href = "/#"; 
      }, 1500)
    } catch (err) {
      console.error(err)
      setError("Hiba történt a bejelentkezés során.")
      showAlert("Hiba történt a bejelentkezés során.")
    }
  }  

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-red-700 text-white py-4 px-6">
          <h1 className="text-2xl font-bold">Bejelentkezés</h1>
        </div>

        {alert.show && (
          <div
            className={`p-4 mb-4 mx-6 mt-6 rounded-md ${
              alert.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
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
            <label htmlFor="email" className="text-gray-700 block">
              Email cím
            </label>
            <input
              id="email"
              type="email"
              placeholder="pelda@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="jelszo" className="text-gray-700 block">
              Jelszó
            </label>
            <input
              id="jelszo"
              type="password"
              value={jelszo}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
         
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button type="submit" className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-800">
            Bejelentkezés
          </button>

          <div className="text-center text-gray-600 text-sm">
            Nincs még fiókod?{" "}
            <a href="/register" className="text-red-700 hover:underline font-medium">
              Regisztrálj most
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}

