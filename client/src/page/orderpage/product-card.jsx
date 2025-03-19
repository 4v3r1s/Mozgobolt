import { ShoppingCart, Heart } from "lucide-react"
import { Button } from "./Button"
import { Badge } from "./badge"

export default function ProductCard() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img src="/placeholder.svg?height=200&width=300" alt="Product" className="w-full h-48 object-cover" />
        <Badge className="absolute top-2 right-2 bg-red-700">Akció</Badge>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">Termék neve</h3>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-red-700 font-bold">1.290 Ft</span>
          <span className="text-gray-500 text-sm line-through">1.590 Ft</span>
        </div>
        <p className="text-gray-500 text-sm mb-4">300g (4.300 Ft/kg)</p>
        <div className="flex gap-2">
          <Button className="flex-1 bg-red-700 hover:bg-red-800">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Kosárba
          </Button>
          <Button variant="outline" size="icon" className="border-red-700 text-red-700 hover:bg-red-50">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

