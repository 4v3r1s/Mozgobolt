"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Profile() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    newsletter: false,
    registrationDate: ""
  })
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success", // success or error
  })

  const showAlert = (message, type = "error") => {
    setAlert({
      show: true,
      message,
      type,
    })

    // Auto-hide alert after 5 seconds
    setTimeout(() => {
      setAlert((prev) => ({ ...prev, show: false }))
    }, 5000)
  }

  useEffect(() => {
    const checkAuth = () => {
      // Get token from cookie
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      if (!token) {
        setIsAuthenticated(false)
        setLoading(false)
        return false
      }
      
      setIsAuthenticated(true)
      return true
    }

    const fetchUserData = async () => {
      try {
        if (!checkAuth()) return

        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1]

        const response = await fetch("http://localhost:3000/user/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid
            setIsAuthenticated(false)
            return
          }
          throw new Error("Hiba a felhasználói adatok lekérése során")
        }

        const data = await response.json()
        setUserData({
          username: data.felhasznalonev || "Nincs megadva",
          email: data.email || "Nincs megadva",
          newsletter: data.hirlevel || false,
          registrationDate: data.regisztracio_datum 
            ? new Date(data.regisztracio_datum).toLocaleDateString('hu-HU') 
            : "Nincs adat"
        })
      } catch (error) {
        console.error("Error fetching user data:", error)
        showAlert("Hiba történt az adatok betöltése során.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleLogout = () => {
    // Clear token cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    
    // Show success message
    showAlert("Sikeres kijelentkezés!", "success")
    setIsAuthenticated(false)
    
    // Redirect to home after short delay
    setTimeout(() => {
      navigate('/')
    }, 1500)
  }

  const handleLogin = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-red-700 text-white py-4 px-6">
          <h1 className="text-2xl font-bold">Fiókom</h1>
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

        <div className="p-6 space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Adatok betöltése...</p>
            </div>
          ) : !isAuthenticated ? (
            <div className="text-center py-8 space-y-6">
              <div className="space-y-2">
                <p className="text-gray-700 text-lg">A fiók megtekintéséhez be kell jelentkezned.</p>
                <p className="text-gray-500">Kérjük, jelentkezz be a fiókodba vagy regisztrálj, ha még nem rendelkezel fiókkal.</p>
              </div>
              
              <div className="flex flex-col space-y-3">
                <button 
                  className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-800"
                  onClick={handleLogin}
                >
                  Bejelentkezés
                </button>
                <a 
                  href="/register" 
                  className="w-full bg-gray-100 text-gray-800 py-2 rounded hover:bg-gray-200 text-center"
                >
                  Regisztráció
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Személyes adatok</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Felhasználónév</p>
                      <p className="font-medium">{userData.username}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email cím</p>
                      <p className="font-medium">{userData.email}</p>
                    </div>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Fiók információk</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Regisztráció dátuma</p>
                      <p className="font-medium">{userData.registrationDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Hírlevél feliratkozás</p>
                      <p className="font-medium">{userData.newsletter ? "Feliratkozva" : "Nincs feliratkozva"}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Fiók műveletek</h2>
                  <div className="flex flex-col space-y-3">
                    <button 
                      className="w-full bg-gray-100 text-gray-800 py-2 rounded hover:bg-gray-200"
                      onClick={() => navigate('/profile/edit')}
                    >
                      Adatok szerkesztése
                    </button>
                    <button 
                      className="w-full bg-gray-100 text-gray-800 py-2 rounded hover:bg-gray-200"
                      onClick={() => navigate('/profile/orders')}
                    >
                      Rendeléseim
                    </button>
                    <button 
                      className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-800"
                      onClick={handleLogout}
                    >
                      Kijelentkezés
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
