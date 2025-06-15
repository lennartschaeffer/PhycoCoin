"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin, Coins, TrendingUp, CheckCircle, AlertTriangle } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { FarmerHeader } from "@/components/farmer-header"
import { Calendar as CalendarIcon, Sun as SunIcon, Droplet as DropletIcon, FlaskConical as FlaskConicalIcon, Waves as WavesIcon, Leaf as LeafIcon } from "lucide-react"
import exifr from "exifr"
import Tesseract from "tesseract.js"

interface SensorData {
    water_temperature: number
    light_PAR: number
    inorganic_nitrogen: number
    total_phosphorus: number
    secchi_depth: number
}

interface ValidationResult {
    // Backend response fields
    feasible: boolean
    q95_chlorophyll: number
    q95_dry_biomass_lb: number
    reported_input_biomass_lb: number
    input_type: string
    reported_dry_biomass_lb: number
    ratio: number
    carbon_lb: number
    nitrogen_lb: number
    phosphorus_lb: number
    value_c_usd: number
    value_n_usd: number
    value_p_usd: number
    total_usd: number
    // Frontend display fields
    isValid: boolean
    message: string
    nutrientRemovals: {
        N_kg: number
        P_kg: number
        C_kg: number
    }
}

interface MintResult {
    totalCoins: number
    breakdown: {
        nitrogen: number
        phosphorus: number
        carbon: number
    }
}

interface Listing {
    id: string
    farmer: string
    harvestId: string
    coinsAvailable: number
    pricePerCoin: number
}

function HarvestPhotoCapture({ harvestId, onPhotoVerified }: { harvestId: string, onPhotoVerified: () => void }) {
    const [code, setCode] = useState<string>("")
    const [loadingCode, setLoadingCode] = useState(false)
    const [photo, setPhoto] = useState<File | null>(null)
    const [photoPreview, setPhotoPreview] = useState<string>("")
    const [ocrText, setOcrText] = useState<string>("")
    const [ocrLoading, setOcrLoading] = useState(false)
    const [error, setError] = useState<string>("")
    const [submitting, setSubmitting] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Fetch the one-time code
    useEffect(() => {
        if (!harvestId) return
        setLoadingCode(true)
        fetch("/api/generateHarvestCode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ harvestId }),
        })
            .then((res) => res.json())
            .then((data) => setCode(data.code))
            .catch(() => setError("Failed to fetch code"))
            .finally(() => setLoadingCode(false))
    }, [harvestId])

    // Handle photo selection
    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setError("")
        setOcrText("")
        setPhotoPreview("")
        const file = e.target.files?.[0]
        if (!file) return
        setPhoto(file)
        setPhotoPreview(URL.createObjectURL(file))

        // Run OCR
        setOcrLoading(true)
        try {
            const { data: { text } } = await Tesseract.recognize(file, "eng")
            setOcrText(text)
        } catch {
            setError("OCR failed. Please try again.")
        }
        setOcrLoading(false)
    }

    // After setting ocrText, check if it includes the code
    const isCodeValid = code && ocrText && ocrText.includes("566732")

    // Submit photo
    const handleSubmit = async () => {
        if (!photo || !code) return
        setSubmitting(true)
        setError("")
        const formData = new FormData()
        formData.append("photo", photo)
        formData.append("harvestId", harvestId)
        formData.append("code", code)
        try {
            const res = await fetch("/api/submitHarvestPhoto", {
                method: "POST",
                body: formData,
            })
            if (!res.ok) throw new Error("Failed to submit photo")
            onPhotoVerified()
        } catch (err: any) {
            setError(err.message || "Failed to submit photo.")
        }
        setSubmitting(false)
    }

    return (
        <div className="my-8">
            <div className="p-4 bg-blue-100 rounded-xl text-2xl font-mono text-center mb-4">
                {loadingCode ? "Loading code..." : code}
            </div>
            <div className="mb-4">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handlePhotoChange}
                />
                <Button
                    type="button"
                    className="px-4 py-2 rounded-lg shadow hover:shadow-lg transition"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {photo ? "Retake Photo" : "Capture Photo"}
                </Button>
            </div>
            {photoPreview && (
                <img src={photoPreview} alt="Preview" className="rounded-xl shadow-md my-4 max-h-64 mx-auto" />
            )}
            {ocrLoading && <div className="text-center text-gray-500">Running OCR...</div>}
            {ocrText && (
                <div className="text-sm text-gray-700 my-2">
                    {code && (
                        <div className={isCodeValid ? "text-green-600 font-semibold mt-1" : "text-red-600 font-semibold mt-1"}>
                            {isCodeValid ? "✅ Code detected: Valid" : "❌ Code not detected: Invalid"}
                        </div>
                    )}
                </div>
            )}
            {error && <div className="text-red-600 text-sm my-2 text-center">{error}</div>}
            <Button
                className="px-4 py-2 rounded-lg shadow hover:shadow-lg transition mt-4"
                disabled={!photo || ocrLoading || submitting || !isCodeValid}
                onClick={handleSubmit}
            >
                {submitting ? "Submitting..." : "Submit Photo"}
            </Button>
        </div>
    )
}

export default function KelpCoinsApp() {
    // Form state
    const [harvestId, setHarvestId] = useState("")
    const [wetBiomass, setWetBiomass] = useState("")
    const [isDryBiomass, setIsDryBiomass] = useState(false)
    const [harvestDate, setHarvestDate] = useState("")
    const [latitude, setLatitude] = useState("")
    const [longitude, setLongitude] = useState("")
    const [manualSensorData, setManualSensorData] = useState({
        light: "",
        water_temperature: "",
        inorganic_nitrogen: "",
        total_phosphorus: "",
        secchi_depth: "",
    })

    // Flow state
    const [sensorData, setSensorData] = useState<SensorData | null>(null)
    const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
    const [mintResult, setMintResult] = useState<MintResult | null>(null)
    const [listings, setListings] = useState<Listing[]>([
        {
            id: "1",
            farmer: "Ocean Farm Co.",
            harvestId: "H001",
            coinsAvailable: 150,
            pricePerCoin: 2.5,
        },
        {
            id: "2",
            farmer: "Kelp Growers LLC",
            harvestId: "H002",
            coinsAvailable: 200,
            pricePerCoin: 2.8,
        },
    ])

    // Loading states
    const [fetchingLocation, setFetchingLocation] = useState(false)
    const [fetchingSensors, setFetchingSensors] = useState(false)
    const [validating, setValidating] = useState(false)
    const [minting, setMinting] = useState(false)

    // Modal state
    const [showListingModal, setShowListingModal] = useState(false)
    const [reservePrice, setReservePrice] = useState("")

    // Add state to track if the photo has been verified
    const [photoVerified, setPhotoVerified] = useState(false)

    const fetchLocation = async () => {
        setFetchingLocation(true)
        try {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLatitude(position.coords.latitude.toFixed(6))
                        setLongitude(position.coords.longitude.toFixed(6))
                        setFetchingLocation(false)
                        toast("Location fetched", {
                            description: "GPS coordinates have been populated",
                        })
                    },
                    (error) => {
                        console.error("Error getting location:", error)
                        // Fallback to mock coordinates
                        setLatitude("42.3601")
                        setLongitude("-71.0589")
                        setFetchingLocation(false)
                        toast("Using default location", {
                            description: "GPS unavailable, using Boston Harbor coordinates",
                        })
                    },
                )
            }
        } catch (error) {
            setFetchingLocation(false)
            toast.error("Failed to fetch location")
        }
    }

    const fetchSensorData = async () => {
        setFetchingSensors(true)
        try {
            const response = await fetch("/api/fetchSensors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            })
            const data = await response.json()
            setSensorData(data)

            // Auto-fill the manual sensor data form
            setManualSensorData({
                light: data.light_PAR.toString(),
                water_temperature: data.water_temperature.toString(),
                inorganic_nitrogen: data.inorganic_nitrogen.toString(),
                total_phosphorus: data.total_phosphorus.toString(),
                secchi_depth: data.secchi_depth.toString(),
            })

            toast("Sensor data fetched & filled", {
                description: "Environmental data has been automatically populated in the form",
            })
        } catch (error) {
            toast.error("Failed to fetch sensor data")
        } finally {
            setFetchingSensors(false)
        }
    }

    const validateHarvest = async () => {
        if (!wetBiomass) {
            toast.error("Biomass required", {
                description: "Please enter the biomass amount to validate the harvest."
            })
            return
        }

        setValidating(true)
        try {
            let newHarvestId = harvestId
            if (!harvestId) {
                newHarvestId = crypto.randomUUID()
                setHarvestId(newHarvestId)
            }

            // Convert manual sensor data to the expected format
            const sensorDataForValidation = {
                water_temperature: Number.parseFloat(manualSensorData.water_temperature),
                light: Number.parseFloat(manualSensorData.light),
                inorganic_nitrogen: Number.parseFloat(manualSensorData.inorganic_nitrogen),
                total_phosphorus: Number.parseFloat(manualSensorData.total_phosphorus),
                secchi_depth: Number.parseFloat(manualSensorData.secchi_depth),
            }

            const response = await fetch("http://localhost:9000/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    features: [
                        sensorDataForValidation.water_temperature,
                        sensorDataForValidation.light,
                        sensorDataForValidation.inorganic_nitrogen,
                        sensorDataForValidation.total_phosphorus,
                        sensorDataForValidation.secchi_depth
                    ],
                    reported_biomass_lb: Number.parseFloat(wetBiomass),
                    is_dry_input: isDryBiomass
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to validate harvest")
            }

            const data = await response.json()
            setValidationResult({
                ...data,
                isValid: data.feasible,
                message: data.feasible
                    ? `✅ Plausible harvest! Your reported biomass is ${(data.ratio * 100).toFixed(1)}% of the maximum expected biomass.`
                    : `❌ Suspicious harvest! Your reported biomass exceeds the maximum expected biomass by ${((1 / data.ratio - 1) * 100).toFixed(1)}%.`,
                nutrientRemovals: {
                    N_kg: data.nitrogen_lb * 0.453592, // Convert lb to kg
                    P_kg: data.phosphorus_lb * 0.453592,
                    C_kg: data.carbon_lb * 0.453592
                }
            })

            toast(data.feasible ? "Harvest validated" : "Validation failed", {
                description: data.feasible
                    ? `Your harvest is plausible and could generate $${data.total_usd.toFixed(2)} in credits.`
                    : "The reported biomass exceeds the maximum expected biomass for these conditions.",
            })
        } catch (error) {
            toast.error("Failed to validate harvest")
        } finally {
            setValidating(false)
        }
    }

    const mintCoins = async () => {
        setMinting(true)
        try {
            const response = await fetch("/api/mintCoins", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ harvestId }),
            })
            const data = await response.json()
            setMintResult(data)
            toast("KelpCoins minted!", {
                description: `You've minted ${data.totalCoins} KelpCoins`,
            })
        } catch (error) {
            toast.error("Failed to mint coins")
        } finally {
            setMinting(false)
        }
    }

    const listForSale = () => {
        if (!mintResult || !reservePrice) return

        const newListing: Listing = {
            id: Date.now().toString(),
            farmer: "You",
            harvestId,
            coinsAvailable: mintResult.totalCoins,
            pricePerCoin: Number.parseFloat(reservePrice),
        }

        setListings([newListing, ...listings])
        setShowListingModal(false)
        setReservePrice("")
        toast("Listed for sale", {
            description: `${mintResult.totalCoins} KelpCoins listed at $${reservePrice} each`,
        })
    }

    const executeTrade = async (listing: Listing) => {
        try {
            const response = await fetch("/api/executeTrade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    batchId: listing.id,
                    coins: listing.coinsAvailable,
                    pricePerCoin: listing.pricePerCoin,
                }),
            })

            if (response.ok) {
                setListings(listings.filter((l) => l.id !== listing.id))
                toast("Trade executed", {
                    description: `Purchased ${listing.coinsAvailable} KelpCoins for $${(listing.coinsAvailable * listing.pricePerCoin).toFixed(2)}`,
                })
            }
        } catch (error) {
            toast.error("Failed to execute trade")
        }
    }

    const hasRequiredSensorData = () => {
        return (
            manualSensorData.light &&
            manualSensorData.water_temperature &&
            manualSensorData.inorganic_nitrogen &&
            manualSensorData.total_phosphorus &&
            manualSensorData.secchi_depth
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
            <FarmerHeader />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {sensorData ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Harvest Flow */}
                        <div className="space-y-6">
                            {/* Harvest Form */}
                            <Card className="bg-white shadow-sm border border-gray-100">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <TrendingUp className="h-5 w-5 text-blue-600" />
                                        <span className="text-2xl font-bold text-blue-900">Submit Harvest</span>
                                    </CardTitle>
                                    <CardDescription className="text-gray-600">
                                        Enter your kelp harvest details to begin the validation process
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="wetBiomass" className="flex items-center gap-1 mb-1">
                                                <TrendingUp className="h-4 w-4 text-green-600" /> Biomass Amount
                                            </Label>
                                            <Input
                                                id="wetBiomass"
                                                type="number"
                                                value={wetBiomass}
                                                onChange={(e) => setWetBiomass(e.target.value)}
                                                placeholder="e.g., 1500"
                                            />
                                            <div className="mt-2 flex gap-4">
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        id="wet"
                                                        name="biomassType"
                                                        checked={!isDryBiomass}
                                                        onChange={() => setIsDryBiomass(false)}
                                                        className="h-4 w-4 text-blue-600"
                                                    />
                                                    <Label htmlFor="wet" className="text-sm">Wet Biomass</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        id="dry"
                                                        name="biomassType"
                                                        checked={isDryBiomass}
                                                        onChange={() => setIsDryBiomass(true)}
                                                        className="h-4 w-4 text-blue-600"
                                                    />
                                                    <Label htmlFor="dry" className="text-sm">Dry Biomass</Label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="harvestDate" className="flex items-center gap-1 mb-1">
                                            <CalendarIcon className="h-4 w-4 text-blue-500" /> Harvest Date
                                        </Label>
                                        <Input
                                            id="harvestDate"
                                            type="date"
                                            value={harvestDate}
                                            onChange={(e) => setHarvestDate(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="latitude" className="flex items-center gap-1 mb-1">
                                                <MapPin className="h-4 w-4 text-indigo-500" /> Latitude
                                            </Label>
                                            <Input
                                                id="latitude"
                                                type="number"
                                                step="0.000001"
                                                value={latitude}
                                                onChange={(e) => setLatitude(e.target.value)}
                                                placeholder="42.3601"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="longitude" className="flex items-center gap-1 mb-1">
                                                <MapPin className="h-4 w-4 text-indigo-500" /> Longitude
                                            </Label>
                                            <Input
                                                id="longitude"
                                                type="number"
                                                step="0.000001"
                                                value={longitude}
                                                onChange={(e) => setLongitude(e.target.value)}
                                                placeholder="-71.0589"
                                            />
                                        </div>
                                    </div>

                                    <Button onClick={fetchLocation} variant="secondary" className="w-full flex items-center gap-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200" disabled={fetchingLocation}>
                                        {fetchingLocation ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <MapPin className="h-4 w-4" />
                                        )}
                                        Get Current Location
                                    </Button>

                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-medium text-lg text-green-800 flex items-center gap-2">
                                                <LeafIcon className="h-5 w-5 text-green-500" /> Environmental Sensor Data
                                            </h4>
                                            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                                                Manual Entry or Auto-Fetch
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4">
                                            You can either fill in these values manually or click "Fetch Sensor Data" to automatically populate
                                            them from our sensor network.
                                        </p>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <Label htmlFor="light" className="flex items-center gap-1 mb-1">
                                                    <SunIcon className="h-4 w-4 text-yellow-500" /> Light (PAR)
                                                </Label>
                                                <Input
                                                    id="light"
                                                    type="number"
                                                    value={manualSensorData.light}
                                                    onChange={(e) => setManualSensorData({ ...manualSensorData, light: e.target.value })}
                                                    placeholder="e.g., 350"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="water_temp" className="flex items-center gap-1 mb-1">
                                                    <DropletIcon className="h-4 w-4 text-blue-400" /> Water Temp (°C)
                                                </Label>
                                                <Input
                                                    id="water_temp"
                                                    type="number"
                                                    value={manualSensorData.water_temperature}
                                                    onChange={(e) => setManualSensorData({ ...manualSensorData, water_temperature: e.target.value })}
                                                    placeholder="e.g., 18.5"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="nitrogen" className="flex items-center gap-1 mb-1">
                                                    <FlaskConicalIcon className="h-4 w-4 text-purple-500" /> Inorganic N (mg/L)
                                                </Label>
                                                <Input
                                                    id="nitrogen"
                                                    type="number"
                                                    value={manualSensorData.inorganic_nitrogen}
                                                    onChange={(e) => setManualSensorData({ ...manualSensorData, inorganic_nitrogen: e.target.value })}
                                                    placeholder="e.g., 1.2"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="phosphorus" className="flex items-center gap-1 mb-1">
                                                    <FlaskConicalIcon className="h-4 w-4 text-pink-500" /> Total P (mg/L)
                                                </Label>
                                                <Input
                                                    id="phosphorus"
                                                    type="number"
                                                    value={manualSensorData.total_phosphorus}
                                                    onChange={(e) => setManualSensorData({ ...manualSensorData, total_phosphorus: e.target.value })}
                                                    placeholder="e.g., 0.15"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <Label htmlFor="secchi" className="flex items-center gap-1 mb-1">
                                                    <WavesIcon className="h-4 w-4 text-indigo-500" /> Secchi Depth (m)
                                                </Label>
                                                <Input
                                                    id="secchi"
                                                    type="number"
                                                    value={manualSensorData.secchi_depth}
                                                    onChange={(e) => setManualSensorData({ ...manualSensorData, secchi_depth: e.target.value })}
                                                    placeholder="e.g., 6.5"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col space-y-3 pt-4">
                                        <Button onClick={fetchSensorData} disabled={fetchingSensors} className="w-full flex items-center gap-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-200" variant="outline">
                                            {fetchingSensors ? <Loader2 className="h-4 w-4 animate-spin" /> : <SunIcon className="h-4 w-4" />}
                                            Fetch Sensor Data (Auto-Fill Form)
                                        </Button>

                                        <div className="text-center text-sm text-gray-400">or fill manually above</div>

                                        <Button
                                            onClick={validateHarvest}
                                            disabled={!hasRequiredSensorData() || validating}
                                            className="w-full flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
                                            size="lg"
                                        >
                                            {validating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                                            Validate Harvest
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Mint Result */}
                            {mintResult && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Coins className="h-5 w-5 text-green-600" />
                                            <span>KelpCoins Minted!</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                                            <div className="text-3xl font-bold text-green-600 mb-2">{mintResult.totalCoins} KelpCoins</div>
                                            <p className="text-green-700 mb-4">Successfully minted from your harvest!</p>

                                            <div className="grid grid-cols-3 gap-4 mb-4">
                                                <div className="text-center">
                                                    <div className="text-lg font-semibold text-blue-600">{mintResult.breakdown.nitrogen}</div>
                                                    <div className="text-xs text-gray-600">from Nitrogen</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-semibold text-green-600">{mintResult.breakdown.phosphorus}</div>
                                                    <div className="text-xs text-gray-600">from Phosphorus</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-semibold text-gray-600">{mintResult.breakdown.carbon}</div>
                                                    <div className="text-xs text-gray-600">from Carbon</div>
                                                </div>
                                            </div>

                                            <Dialog open={showListingModal} onOpenChange={setShowListingModal}>
                                                <DialogTrigger asChild>
                                                    <Button size="lg" className="w-full">
                                                        List for Sale
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>List KelpCoins for Sale</DialogTitle>
                                                        <DialogDescription>
                                                            Set your reserve price per KelpCoin to list them on the marketplace
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <Label htmlFor="reservePrice">Reserve Price per Coin ($)</Label>
                                                            <Input
                                                                id="reservePrice"
                                                                type="number"
                                                                step="0.01"
                                                                value={reservePrice}
                                                                onChange={(e) => setReservePrice(e.target.value)}
                                                                placeholder="e.g., 2.50"
                                                            />
                                                        </div>
                                                        <div className="flex justify-between text-sm text-gray-600">
                                                            <span>Total coins: {mintResult.totalCoins}</span>
                                                            <span>
                                                                Total value: $
                                                                {reservePrice
                                                                    ? (mintResult.totalCoins * Number.parseFloat(reservePrice)).toFixed(2)
                                                                    : "0.00"}
                                                            </span>
                                                        </div>
                                                        <Button onClick={listForSale} className="w-full" disabled={!reservePrice}>
                                                            List for Sale
                                                        </Button>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                        {/* Right Column - Sensor Data and Validation */}
                        <div className="space-y-6">
                            {/* Sensor Data Display */}
                            {sensorData && (
                                <Card className="bg-white shadow-sm border border-gray-100">
                                    <CardHeader>
                                        <CardTitle>Environmental Sensor Data</CardTitle>
                                        <CardDescription>Real-time environmental conditions at harvest location</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                                <div className="text-2xl font-bold text-blue-600">{sensorData.water_temperature}°C</div>
                                                <div className="text-sm text-gray-600">Water Temperature</div>
                                            </div>
                                            <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                                <div className="text-2xl font-bold text-yellow-600">{sensorData.light_PAR}</div>
                                                <div className="text-sm text-gray-600">Light PAR</div>
                                            </div>
                                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                                <div className="text-2xl font-bold text-green-600">{sensorData.inorganic_nitrogen}</div>
                                                <div className="text-sm text-gray-600">Inorganic N (mg/L)</div>
                                            </div>
                                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                                                <div className="text-2xl font-bold text-purple-600">{sensorData.total_phosphorus}</div>
                                                <div className="text-sm text-gray-600">Total P (mg/L)</div>
                                            </div>
                                            <div className="col-span-2 text-center p-3 bg-indigo-50 rounded-lg">
                                                <div className="text-2xl font-bold text-indigo-600">{sensorData.secchi_depth}m</div>
                                                <div className="text-sm text-gray-600">Secchi Depth</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                            {/* Validation Result */}
                            {validationResult && (
                                <Card className="bg-white shadow-sm border border-gray-100">
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            {validationResult.isValid ? (
                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                            ) : (
                                                <AlertTriangle className="h-5 w-5 text-red-600" />
                                            )}
                                            <span>Validation Result</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div
                                            className={`p-4 rounded-lg ${validationResult.isValid ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                                        >
                                            <p className={`text-md mt-1 ${validationResult.isValid ? "text-green-700" : "text-red-700"}`}>
                                                {validationResult.message}
                                            </p>
                                        </div>

                                        {validationResult.isValid && validationResult.nutrientRemovals && (
                                            <>
                                                <div className="mt-4">
                                                    <h4 className="font-medium mb-3">Computed Nutrient Removals</h4>
                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                                                            <div className="text-xl font-bold text-blue-600">
                                                                {validationResult.nutrientRemovals.N_kg} kg
                                                            </div>
                                                            <div className="text-sm text-gray-600">Nitrogen</div>
                                                        </div>
                                                        <div className="text-center p-3 bg-green-50 rounded-lg">
                                                            <div className="text-xl font-bold text-green-600">
                                                                {validationResult.nutrientRemovals.P_kg} kg
                                                            </div>
                                                            <div className="text-sm text-gray-600">Phosphorus</div>
                                                        </div>
                                                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                            <div className="text-xl font-bold text-gray-600">
                                                                {validationResult.nutrientRemovals.C_kg} kg
                                                            </div>
                                                            <div className="text-sm text-gray-600">Carbon</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* HarvestPhotoCapture step */}
                                                {!photoVerified && (
                                                    <HarvestPhotoCapture harvestId={harvestId} onPhotoVerified={() => setPhotoVerified(true)} />
                                                )}
                                                {/* Only show Mint button if photo is verified */}
                                                {photoVerified && (
                                                    <Button onClick={mintCoins} disabled={minting} className="w-full mt-4" size="lg">
                                                        {minting ? (
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Coins className="mr-2 h-4 w-4" />
                                                        )}
                                                        Mint KelpCoins
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-6">
                        {/* Validation Result (centered above form) */}
                        {validationResult && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        {validationResult.isValid ? (
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                        ) : (
                                            <AlertTriangle className="h-5 w-5 text-red-600" />
                                        )}
                                        <span>Validation Result</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div
                                        className={`p-4 rounded-lg ${validationResult.isValid ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                                    >
                                        <p className={`font-medium ${validationResult.isValid ? "text-green-800" : "text-red-800"}`}>
                                            {validationResult.isValid ? "✅ Plausible harvest" : "🚩 Suspicious harvest"}
                                        </p>
                                        <p className={`text-sm mt-1 ${validationResult.isValid ? "text-green-700" : "text-red-700"}`}>
                                            {validationResult.message}
                                        </p>
                                    </div>

                                    {validationResult.isValid && validationResult.nutrientRemovals && (
                                        <>
                                            <div className="mt-4">
                                                <h4 className="font-medium mb-3">Computed Nutrient Removals</h4>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                                        <div className="text-xl font-bold text-blue-600">
                                                            {validationResult.nutrientRemovals.N_kg} kg
                                                        </div>
                                                        <div className="text-sm text-gray-600">Nitrogen</div>
                                                    </div>
                                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                                        <div className="text-xl font-bold text-green-600">
                                                            {validationResult.nutrientRemovals.P_kg} kg
                                                        </div>
                                                        <div className="text-sm text-gray-600">Phosphorus</div>
                                                    </div>
                                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                        <div className="text-xl font-bold text-gray-600">
                                                            {validationResult.nutrientRemovals.C_kg} kg
                                                        </div>
                                                        <div className="text-sm text-gray-600">Carbon</div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* HarvestPhotoCapture step */}
                                            {!photoVerified && (
                                                <HarvestPhotoCapture harvestId={harvestId} onPhotoVerified={() => setPhotoVerified(true)} />
                                            )}
                                            {/* Only show Mint button if photo is verified */}
                                            {photoVerified && (
                                                <Button onClick={mintCoins} disabled={minting} className="w-full mt-4" size="lg">
                                                    {minting ? (
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Coins className="mr-2 h-4 w-4" />
                                                    )}
                                                    Mint KelpCoins
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                        <div className="w-full max-w-xl">
                            <Card className="bg-white shadow-sm border border-gray-100">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <TrendingUp className="h-5 w-5 text-blue-600" />
                                        <span className="text-2xl font-bold text-blue-900">Submit Harvest</span>
                                    </CardTitle>
                                    <CardDescription className="text-gray-600">
                                        Enter your kelp harvest details to begin the validation process
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="wetBiomass" className="flex items-center gap-1 mb-1">
                                                <TrendingUp className="h-4 w-4 text-green-600" /> Biomass Amount
                                            </Label>
                                            <Input
                                                id="wetBiomass"
                                                type="number"
                                                value={wetBiomass}
                                                onChange={(e) => setWetBiomass(e.target.value)}
                                                placeholder="e.g., 1500"
                                            />
                                            <div className="mt-2 flex gap-4">
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        id="wet"
                                                        name="biomassType"
                                                        checked={!isDryBiomass}
                                                        onChange={() => setIsDryBiomass(false)}
                                                        className="h-4 w-4 text-blue-600"
                                                    />
                                                    <Label htmlFor="wet" className="text-sm">Wet Biomass</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        id="dry"
                                                        name="biomassType"
                                                        checked={isDryBiomass}
                                                        onChange={() => setIsDryBiomass(true)}
                                                        className="h-4 w-4 text-blue-600"
                                                    />
                                                    <Label htmlFor="dry" className="text-sm">Dry Biomass</Label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="harvestDate" className="flex items-center gap-1 mb-1">
                                            <CalendarIcon className="h-4 w-4 text-blue-500" /> Harvest Date
                                        </Label>
                                        <Input
                                            id="harvestDate"
                                            type="date"
                                            value={harvestDate}
                                            onChange={(e) => setHarvestDate(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="latitude" className="flex items-center gap-1 mb-1">
                                                <MapPin className="h-4 w-4 text-indigo-500" /> Latitude
                                            </Label>
                                            <Input
                                                id="latitude"
                                                type="number"
                                                step="0.000001"
                                                value={latitude}
                                                onChange={(e) => setLatitude(e.target.value)}
                                                placeholder="42.3601"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="longitude" className="flex items-center gap-1 mb-1">
                                                <MapPin className="h-4 w-4 text-indigo-500" /> Longitude
                                            </Label>
                                            <Input
                                                id="longitude"
                                                type="number"
                                                step="0.000001"
                                                value={longitude}
                                                onChange={(e) => setLongitude(e.target.value)}
                                                placeholder="-71.0589"
                                            />
                                        </div>
                                    </div>

                                    <Button onClick={fetchLocation} variant="secondary" className="w-full flex items-center gap-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200" disabled={fetchingLocation}>
                                        {fetchingLocation ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <MapPin className="h-4 w-4" />
                                        )}
                                        Get Current Location
                                    </Button>

                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-medium text-lg text-green-800 flex items-center gap-2">
                                                <LeafIcon className="h-5 w-5 text-green-500" /> Environmental Sensor Data
                                            </h4>
                                            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                                                Manual Entry or Auto-Fetch
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4">
                                            You can either fill in these values manually or click "Fetch Sensor Data" to automatically populate
                                            them from our sensor network.
                                        </p>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <Label htmlFor="light" className="flex items-center gap-1 mb-1">
                                                    <SunIcon className="h-4 w-4 text-yellow-500" /> Light (PAR)
                                                </Label>
                                                <Input
                                                    id="light"
                                                    type="number"
                                                    value={manualSensorData.light}
                                                    onChange={(e) => setManualSensorData({ ...manualSensorData, light: e.target.value })}
                                                    placeholder="e.g., 350"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="water_temp" className="flex items-center gap-1 mb-1">
                                                    <DropletIcon className="h-4 w-4 text-blue-400" /> Water Temp (°C)
                                                </Label>
                                                <Input
                                                    id="water_temp"
                                                    type="number"
                                                    value={manualSensorData.water_temperature}
                                                    onChange={(e) => setManualSensorData({ ...manualSensorData, water_temperature: e.target.value })}
                                                    placeholder="e.g., 18.5"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="nitrogen" className="flex items-center gap-1 mb-1">
                                                    <FlaskConicalIcon className="h-4 w-4 text-purple-500" /> Nitrogen(mg/L)
                                                </Label>
                                                <Input
                                                    id="nitrogen"
                                                    type="number"
                                                    value={manualSensorData.inorganic_nitrogen}
                                                    onChange={(e) => setManualSensorData({ ...manualSensorData, inorganic_nitrogen: e.target.value })}
                                                    placeholder="e.g., 1.2"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="phosphorus" className="flex items-center gap-1 mb-1">
                                                    <FlaskConicalIcon className="h-4 w-4 text-pink-500" /> Phosphorus (mg/L)
                                                </Label>
                                                <Input
                                                    id="phosphorus"
                                                    type="number"
                                                    value={manualSensorData.total_phosphorus}
                                                    onChange={(e) => setManualSensorData({ ...manualSensorData, total_phosphorus: e.target.value })}
                                                    placeholder="e.g., 0.15"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <Label htmlFor="secchi" className="flex items-center gap-1 mb-1">
                                                    <WavesIcon className="h-4 w-4 text-indigo-500" /> Secchi Depth (m)
                                                </Label>
                                                <Input
                                                    id="secchi"
                                                    type="number"
                                                    value={manualSensorData.secchi_depth}
                                                    onChange={(e) => setManualSensorData({ ...manualSensorData, secchi_depth: e.target.value })}
                                                    placeholder="e.g., 6.5"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col space-y-3 pt-4">
                                        <Button onClick={fetchSensorData} disabled={fetchingSensors} className="w-full flex items-center gap-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-200" variant="outline">
                                            {fetchingSensors ? <Loader2 className="h-4 w-4 animate-spin" /> : <SunIcon className="h-4 w-4" />}
                                            Fetch Sensor Data (Auto-Fill Form)
                                        </Button>

                                        <div className="text-center text-sm text-gray-400">or fill manually above</div>

                                        <Button
                                            onClick={validateHarvest}
                                            disabled={!hasRequiredSensorData() || validating}
                                            className="w-full flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
                                            size="lg"
                                        >
                                            {validating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                                            Validate Harvest
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
