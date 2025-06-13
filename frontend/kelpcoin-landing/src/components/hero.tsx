import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-200 py-12 md:py-20 pb-16 md:pb-32 relative overflow-hidden">
      {/* Floating background effect */}
      <div className="absolute top-0 -right-1/2 w-full h-full bg-gradient-radial from-yellow-100/20 to-transparent animate-float" />

      <div className="max-w-6xl mx-auto px-4 md:px-5">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 md:gap-20 items-center">
          <div className="space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight animate-slide-in-left">
              Transforming seaweed farming into a trusted climate solution
            </h1>
            <p className="text-lg md:text-xl text-gray-600 animate-slide-in-left-delay-1 max-w-2xl mx-auto lg:mx-0">
              KelpCoins create a micro carbon marketplace where local farmers earn digital tokens for verified CO₂
              removal.
            </p>
            <div className="animate-slide-in-left-delay-2">
              <Button
                size="lg"
                className="bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white px-6 md:px-9 py-4 md:py-5 rounded-full text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
              >
                View the marketplace
              </Button>
            </div>
          </div>

          <div className="flex justify-center items-center order-1 lg:order-2">
            <div className="relative">
              <Image
                src="/imgaes/kelpcoin.png"
                alt="KelpCoin"
                width={200}
                height={200}
                className="animate-coin-float drop-shadow-2xl sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px]"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
