"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./use-auth";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => void;
}

const NOMINATIM_API = "https://nominatim.openstreetmap.org/reverse";

/**
 * Hook for getting user's geolocation and reverse geocoding to city
 * Auto-requests on mount and saves to user_profiles
 */
export function useGeolocation(): GeolocationState {
  const { user } = useAuth();
  const supabase = createClient();
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reverseGeocode = async (lat: number, lon: number): Promise<string | null> => {
    try {
      const response = await fetch(
        `${NOMINATIM_API}?format=json&lat=${lat}&lon=${lon}`,
        {
          headers: {
            "Accept-Language": "fr",
            "User-Agent": "LesRetraitesTravaillent",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data = await response.json();

      // Extract city name from response
      const cityName =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.county ||
        null;

      return cityName;
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      return null;
    }
  };

  const saveToProfile = async (
    lat: number,
    lon: number,
    cityName: string | null
  ) => {
    if (!user?.id) return;

    try {
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({
          latitude: lat,
          longitude: lon,
          city: cityName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("Error saving geolocation:", updateError);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleLocationSuccess = async (position: GeolocationPosition) => {
    try {
      const { latitude: lat, longitude: lon } = position.coords;

      setLatitude(lat);
      setLongitude(lon);
      setLoading(true);

      // Reverse geocode to get city
      const cityName = await reverseGeocode(lat, lon);
      setCity(cityName);

      // Save to Supabase
      await saveToProfile(lat, lon, cityName);

      setError(null);
    } catch (err) {
      const errorMsg = "Erreur lors de la récupération de la localisation.";
      setError(errorMsg);
      console.error("Location success handler error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationError = (err: GeolocationPositionError) => {
    let errorMsg = "Erreur lors de la récupération de la localisation.";

    switch (err.code) {
      case err.PERMISSION_DENIED:
        errorMsg =
          "Accès à la localisation refusé. Veuillez activer les permissions.";
        break;
      case err.POSITION_UNAVAILABLE:
        errorMsg =
          "Position non disponible. Vérifiez vos paramètres de localisation.";
        break;
      case err.TIMEOUT:
        errorMsg = "Délai d'attente de la localisation dépassé.";
        break;
    }

    setError(errorMsg);
    setLoading(false);
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée par votre navigateur.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      handleLocationSuccess,
      handleLocationError,
      {
        timeout: 10000,
        enableHighAccuracy: false,
      }
    );
  };

  // Auto-request location on mount
  useEffect(() => {
    requestLocation();
  }, []);

  return {
    latitude,
    longitude,
    city,
    loading,
    error,
    requestLocation,
  };
}
