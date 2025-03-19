import { ChevronRight } from "lucide-react"

const categories = [
  { name: "Pékáruk", count: 42 },
  { name: "Tej-Tejtermékek-Margarinok", count: 68 },
  { name: "Hentesáru", count: 54 },
  { name: "Alapvető élelmiszerek-Száraztészták-Hüvelyesek", count: 87 },
  { name: "Befőttek-Savanyúságok-Dzsemmek", count: 32 },
  { name: "Konzervek-Ízesítők", count: 45 },
  { name: "Fűszerek-Alapporok-Leves alapok", count: 29 },
  { name: "Kávé-Tea-Kakaó és a hozzávalók", count: 38 },
  { name: "Sütési alapanyagok", count: 41 },
  { name: "Sütik", count: 63 },
  { name: "Kekszek-Nápolyik", count: 47 },
  { name: "Chipsek-Snackek-Rágcsálnivalók-Rágók", count: 52 },
  { name: "Piskóták-Cukorkák-Nyalókák", count: 36 },
  { name: "Csokoládék", count: 59 },
  { name: "Italok-Üdítők", count: 74 },
]

export default function CategorySidebar() {
  return (
    <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Kategóriák</h2>
      <ul className="space-y-2">
        {categories.map((category, index) => (
          <li key={index}>
            <a
              href="#"
              className="flex items-center justify-between py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-700 rounded-md transition-colors"
            >
              <span className="line-clamp-1">{category.name}</span>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-1">({category.count})</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

