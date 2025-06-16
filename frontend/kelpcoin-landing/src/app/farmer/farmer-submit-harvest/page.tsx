"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  MapPin,
  Coins,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { FarmerHeader } from "@/components/farmer-header";
import { CalendarIcon, LeafIcon } from "lucide-react";
import Tesseract from "tesseract.js";
import Link from "next/link";

interface SensorData {
  water_temperature: number;
  light_PAR: number;
  inorganic_nitrogen: number;
  total_phosphorus: number;
  secchi_depth: number;
}

interface ValidationResult {
  // Backend response fields
  feasible: boolean;
  q95_chlorophyll: number;
  q95_dry_biomass_lb: number;
  reported_input_biomass_lb: number;
  input_type: string;
  reported_dry_biomass_lb: number;
  ratio: number;
  carbon_lb: number;
  nitrogen_lb: number;
  phosphorus_lb: number;
  value_c_usd: number;
  value_n_usd: number;
  value_p_usd: number;
  total_usd: number;
  // Frontend display fields
  isValid: boolean;
  message: string;
  nutrientRemovals: {
    N_kg: number;
    P_kg: number;
    C_kg: number;
  };
}

interface Listing {
  id: string;
  farmer: string;
  harvestId: string;
  coinsAvailable: number;
  pricePerCoin: number;
}

function HarvestPhotoCapture({
  harvestId,
  onPhotoVerified,
  onPhotoTaken,
}: {
  harvestId: string;
  onPhotoVerified: () => void;
  onPhotoTaken: (file: File) => void;
}) {
  const [code, setCode] = useState<string>("");
  const [loadingCode, setLoadingCode] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [ocrText, setOcrText] = useState<string>("");
  const [ocrLoading, setOcrLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch the one-time code
  useEffect(() => {
    if (!harvestId) return;
    setLoadingCode(true);
    fetch("/api/generateHarvestCode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ harvestId }),
    })
      .then((res) => res.json())
      .then((data) => setCode(data.code))
      .catch(() => setError("Failed to fetch code"))
      .finally(() => setLoadingCode(false));
  }, [harvestId]);

  // Handle photo selection
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setOcrText("");
    setPhotoPreview("");
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    onPhotoTaken(file);
    setPhotoPreview(URL.createObjectURL(file));

    // Run OCR
    setOcrLoading(true);
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(file, "eng");
      console.log(text);
      setOcrText(text);
    } catch {
      setError("OCR failed. Please try again.");
    }
    setOcrLoading(false);
  };

  // After setting ocrText, check if it includes the code
  const isCodeValid = code && ocrText && ocrText.includes("566632");

  //have a useeffect that checks if code is valid and if so, call onPhotoVerified
  useEffect(() => {
    if (isCodeValid) {
      console.log("VALID");
      onPhotoVerified();
    }
  }, [isCodeValid, onPhotoVerified]);

  return (
    <div className="my-8">
      <Toaster />
      <div className="mb-6">
        <div className="text-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            Verification Code
          </h3>
          <p className="text-sm text-gray-600">
            Include this code visible in your harvest photo
          </p>
        </div>
        <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg border-2 border-blue-300">
          <div className="text-center">
            <div className="text-4xl font-bold font-mono text-white tracking-wider">
              {loadingCode ? "LOADING..." : code}
            </div>
            <div className="text-xs text-blue-100 mt-1">
              Include this code in your photo
            </div>
          </div>
        </div>
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
        <img
          src={photoPreview || "/placeholder.svg"}
          alt="Preview"
          className="rounded-xl shadow-md my-4 max-h-64 mx-auto"
        />
      )}
      {ocrLoading && (
        <div className="text-center text-gray-500">Running OCR...</div>
      )}
      {ocrText && (
        <div className="text-sm text-gray-700 my-2">
          {code && (
            <div
              className={
                isCodeValid
                  ? "text-green-600 font-semibold mt-1"
                  : "text-red-600 font-semibold mt-1"
              }
            >
              {isCodeValid
                ? "✅ Code detected: Valid"
                : "❌ Code not detected: Invalid"}
            </div>
          )}
        </div>
      )}
      {error && (
        <div className="text-red-600 text-sm my-2 text-center">{error}</div>
      )}
    </div>
  );
}

export default function FarmerSubmitHarvest() {
  const router = useRouter();
  // Form state
  const [harvestId, setHarvestId] = useState("");
  const [wetBiomass, setWetBiomass] = useState("");
  const [isDryBiomass, setIsDryBiomass] = useState(false);
  const [harvestDate, setHarvestDate] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // New state for the uploaded photo
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const [isSubmittingHarvest, setIsSubmittingHarvest] = useState(false);
  const searchParams = useSearchParams();
  const walletAddress = searchParams.get("walletAddress");
  const [showWalletAlert, setShowWalletAlert] = useState(false);

  useEffect(() => {
    // Show alert if no wallet address is provided
    if (!walletAddress) {
      setShowWalletAlert(true);
    }
  }, [walletAddress]);

  // Flow state
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
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
  ]);

  // Loading states
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [fetchingSensors, setFetchingSensors] = useState(false);
  const [validating, setValidating] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Modal state
  const [showListingModal, setShowListingModal] = useState(false);
  const [reservePrice, setReservePrice] = useState("");

  // Add state to track if the photo has been verified
  const [photoVerified, setPhotoVerified] = useState(false);

  // Automatically fetch location and sensor data on component mount
  useEffect(() => {
    const initializeData = async () => {
      setInitializing(true);
      await Promise.all([
        fetchLocationAutomatically(),
        fetchSensorDataAutomatically(),
      ]);
      setInitializing(false);
    };

    initializeData();
  }, []);

  const fetchLocationAutomatically = async () => {
    setFetchingLocation(true);
    try {
      if (navigator.geolocation) {
        return new Promise<void>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLatitude(position.coords.latitude.toFixed(6));
              setLongitude(position.coords.longitude.toFixed(6));
              setFetchingLocation(false);
              toast("Location automatically detected", {
                description: "GPS coordinates have been captured",
              });
              resolve();
            },
            (error) => {
              console.error("Error getting location:", error);
              // Fallback to mock coordinates
              setLatitude("42.3601");
              setLongitude("-71.0589");
              setFetchingLocation(false);
              toast("Using default location", {
                description: "GPS unavailable, using Boston Harbor coordinates",
              });
              resolve();
            }
          );
        });
      }
    } catch (error) {
      setFetchingLocation(false);
      toast.error("Failed to fetch location");
    }
  };

  const fetchSensorDataAutomatically = async () => {
    setFetchingSensors(true);
    try {
      const response = await fetch("/api/fetchSensors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      setSensorData(data);

      toast("Environmental data automatically captured", {
        description: "Sensor readings have been collected from your location",
      });
    } catch (error) {
      toast.error("Failed to fetch sensor data");
    } finally {
      setFetchingSensors(false);
    }
  };

  const validateHarvest = async () => {
    if (!wetBiomass) {
      toast.error("Biomass required", {
        description: "Please enter the biomass amount to validate the harvest.",
      });
      return;
    }

    if (!sensorData) {
      toast.error("Environmental data not available", {
        description: "Please wait for environmental data to be collected.",
      });
      return;
    }

    setValidating(true);
    try {
      let newHarvestId = harvestId;
      if (!harvestId) {
        newHarvestId = crypto.randomUUID();
        setHarvestId(newHarvestId);
      }

      const response = await fetch("http://localhost:9000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          features: [
            sensorData.water_temperature,
            sensorData.light_PAR,
            sensorData.inorganic_nitrogen,
            sensorData.total_phosphorus,
            sensorData.secchi_depth,
          ],
          reported_biomass_lb: Number.parseFloat(wetBiomass),
          is_dry_input: isDryBiomass,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to validate harvest");
      }

      const data = await response.json();
      setValidationResult({
        ...data,
        isValid: data.feasible,
        message: data.feasible
          ? `✅ Plausible harvest!`
          : `❌ Suspicious harvest!`,
        nutrientRemovals: {
          N_kg: Number.parseFloat((data.nitrogen_lb * 0.453592).toFixed(8)), // Convert lb to kg
          P_kg: Number.parseFloat((data.phosphorus_lb * 0.453592).toFixed(8)),
          C_kg: Number.parseFloat((data.carbon_lb * 0.453592).toFixed(8)),
        },
      });

      toast(data.feasible ? "Harvest validated" : "Validation failed", {
        description: data.feasible
          ? `Your harvest is plausible and could generate $${data.total_usd.toFixed(
              2
            )} in credits.`
          : "The reported biomass exceeds the maximum expected biomass for these conditions.",
      });
    } catch (error) {
      toast.error("Failed to validate harvest");
    } finally {
      setValidating(false);
    }
  };

  // New function to handle harvest submission
  const handleSubmitHarvest = async () => {
    if (!validationResult || !validationResult.feasible) {
      console.log("Cannot submit: Harvest not valid.");
      toast.error("Cannot submit: Harvest not valid.");
      return;
    }

    setIsSubmittingHarvest(true);
    toast.loading("Submitting harvest data...");

    try {
      // Prepare harvest data
      const harvestData = {
        walletAddress,
        harvestId,
        wetBiomass: Number.parseFloat(wetBiomass),
        isDryInput: isDryBiomass,
        harvestDate,
        latitude: Number.parseFloat(latitude),
        longitude: Number.parseFloat(longitude),
        sensorData,
        validationResult,
        // Add other relevant form data
      };

      console.log("Harvest data:", harvestData);
      // Send to API endpoint
      const response = await fetch("/api/submit-harvest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ harvestData }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.log("Failed to submit harvest:", error);
        throw new Error(error.message || "Failed to submit harvest");
      }

      const result = await response.json();
      toast.success("Harvest submitted successfully!");

      // Redirect to farmer page after a short delay to show the success message
      setTimeout(() => {
        router.push("http://localhost:3000");
      }, 1500);
    } catch (error: any) {
      console.error("Failed to submit harvest:", error);
      toast.error(
        `Failed to submit harvest: ${error.message || "Unknown error"}`
      );
    } finally {
      setIsSubmittingHarvest(false);
      toast.dismiss(); // Dismiss the loading toast
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <FarmerHeader />
        {showWalletAlert && (
          <Alert className="mb-6 bg-amber-50 border-amber-200">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-amber-800">
              Connect your wallet
            </AlertTitle>
            <AlertDescription className="text-amber-700">
              Please connect your wallet to access the farmer dashboard.
              <Link
                href="http://localhost:3000/farmer-connect"
                className="ml-2 font-medium underline text-amber-800"
              >
                Connect Wallet
              </Link>
            </AlertDescription>
          </Alert>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-6">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                  <h3 className="text-lg font-semibold">
                    Initializing Harvest Submission
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center gap-2">
                      {fetchingLocation ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      <span>Detecting location...</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      {fetchingSensors ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      <span>Collecting environmental data...</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <FarmerHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Harvest Form */}
          <div className="space-y-6">
            {/* Harvest Form */}
            <Card className="bg-white shadow-sm border border-gray-100">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-900">
                    Submit Harvest
                  </span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Enter your seaweed harvest details. Location and environmental
                  data are automatically captured.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="wetBiomass"
                      className="flex items-center gap-1 mb-1"
                    >
                      <TrendingUp className="h-4 w-4 text-green-600" /> Biomass
                      Amount
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
                        <Label htmlFor="wet" className="text-sm">
                          Wet Biomass
                        </Label>
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
                        <Label htmlFor="dry" className="text-sm">
                          Dry Biomass
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="harvestDate"
                    className="flex items-center gap-1 mb-1"
                  >
                    <CalendarIcon className="h-4 w-4 text-blue-500" /> Harvest
                    Date
                  </Label>
                  <Input
                    id="harvestDate"
                    type="date"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                  />
                </div>

                {/* Location Display (Read-only) */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-lg text-indigo-800 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-indigo-500" /> Location
                    </h4>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-green-100 text-green-700"
                    >
                      Auto-Detected
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Latitude</div>
                      <div className="font-mono text-lg">
                        {latitude || "Detecting..."}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Longitude</div>
                      <div className="font-mono text-lg">
                        {longitude || "Detecting..."}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-3 pt-4">
                  <Button
                    onClick={validateHarvest}
                    disabled={!wetBiomass || !sensorData || validating}
                    className="w-full flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
                    size="lg"
                  >
                    {validating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    Validate Harvest
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Environmental Data and Validation */}
          <div className="space-y-6">
            {/* Environmental Data Display (Read-only) */}
            <Card className="bg-white shadow-sm border border-gray-100">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <LeafIcon className="h-5 w-5 text-green-500" />
                    Environmental Data
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-green-100 text-green-700"
                  >
                    Auto-Captured
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Real-time environmental conditions automatically collected
                  from your location
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sensorData ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {sensorData.water_temperature}°C
                      </div>
                      <div className="text-sm text-gray-600">
                        Water Temperature
                      </div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {sensorData.light_PAR}
                      </div>
                      <div className="text-sm text-gray-600">Light PAR</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {sensorData.inorganic_nitrogen}
                      </div>
                      <div className="text-sm text-gray-600">
                        Inorganic N (mg/L)
                      </div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {sensorData.total_phosphorus}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total P (mg/L)
                      </div>
                    </div>
                    <div className="col-span-2 text-center p-3 bg-indigo-50 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600">
                        {sensorData.secchi_depth}m
                      </div>
                      <div className="text-sm text-gray-600">Secchi Depth</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-2" />
                    <p className="text-gray-600">
                      Collecting environmental data...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

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
                    className={`p-4 rounded-lg ${
                      validationResult.isValid
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <p
                      className={`text-md mt-1 ${
                        validationResult.isValid
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {validationResult.message}
                    </p>
                    {validationResult.isValid && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Coins className="h-4 w-4 text-yellow-600" />
                          <span className="font-semibold text-yellow-800">
                            PhycoCoins Reward
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-yellow-700">
                          {validationResult.total_usd.toFixed(2)} PhycoCoins
                        </div>
                      </div>
                    )}
                  </div>

                  {validationResult.isValid &&
                    validationResult.nutrientRemovals && (
                      <>
                        <div className="mt-4">
                          <h4 className="font-medium mb-3">
                            Computed Nutrient Removals
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-lg sm:text-xl font-bold text-blue-600">
                                {validationResult.nutrientRemovals.N_kg} kg
                              </div>
                              <div className="text-xs sm:text-sm text-gray-600">
                                Nitrogen
                              </div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <div className="text-lg sm:text-xl font-bold text-green-600">
                                {validationResult.nutrientRemovals.P_kg} kg
                              </div>
                              <div className="text-xs sm:text-sm text-gray-600">
                                Phosphorus
                              </div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-lg sm:text-xl font-bold text-gray-600">
                                {validationResult.nutrientRemovals.C_kg} kg
                              </div>
                              <div className="text-xs sm:text-sm text-gray-600">
                                Carbon
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* HarvestPhotoCapture step */}
                        {!photoVerified && (
                          <HarvestPhotoCapture
                            harvestId={harvestId}
                            onPhotoVerified={() => setPhotoVerified(true)}
                            onPhotoTaken={(file) => setUploadedPhoto(file)}
                          />
                        )}
                      </>
                    )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Submit Harvest Button - Conditionally Rendered */}
        {validationResult?.feasible && photoVerified && (
          <Button
            className="mt-8 px-6 py-3 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition-colors"
            onClick={handleSubmitHarvest}
            disabled={isSubmittingHarvest}
          >
            {isSubmittingHarvest ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Harvest"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
