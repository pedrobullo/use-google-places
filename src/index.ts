import { useState, useCallback, useEffect } from "react";
import { createSession } from "./utils";
import { API_GOOGLE_URL } from "./constants";

type TProps = {
  apiKey: string;
  output?: "json" | "xml";
  delay?: number;
};

type TResult = {
  title: string;
  description: string;
  placeId: string;
};

export default ({ apiKey, delay = 0, output = "json" }: TProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);

  const sessionToken = createSession();

  const formatPredictions = (predictions: any[]): TResult[] => {
    if (predictions && predictions.length) {
      return predictions.map(
        ({ place_id, structured_formatting, description }) => ({
          title: structured_formatting.main_text,
          description: structured_formatting.secondary_text,
          placeId: place_id,
          address: description,
        })
      );
    }
    return [];
  };

  const request = useCallback(async () => {
    setLoading(true);
    try {
      const results = await fetch(
        `${API_GOOGLE_URL}/place/autocomplete/${output}?input=${keyword}&key=${apiKey}&sessiontoken=${sessionToken}`
      );

      if (results.ok) {
        const { predictions } = await results.json();
        setResults(formatPredictions(predictions));
      } else {
        throw Error("Google Places request error.");
      }
    } catch (error) {
      console.log("Google Places request error.", error.toString());
    }

    setLoading(false);
  }, [keyword]);

  // Debounce on request
  useEffect(() => {
    const handler = setTimeout(() => {
      if (keyword) {
        request();
      }
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);

  const onSelect = async (
    { placeId, address }: { placeId: string; address: string },
    callback: any
  ) => {
    if (!placeId) {
      console.log("Google Places Geocode: Missing place_id!");
      return;
    }

    const results = await fetch(
      `${API_GOOGLE_URL}/geocode/${output}?place_id=${placeId}&key=${apiKey}&sessiontoken=${sessionToken}`
    );

    if (results.ok) {
      const { results: data } = await results.json();
      if (data?.length) {
        const { geometry, address_components } = data[0];
        const callbackParams = {
          neighborhood: address_components[0].long_name,
          street: address_components[1].long_name,
          coordinates: {
            latitude: geometry.location.lat,
            longitude: geometry.location.lng,
          },
        };
        callback(callbackParams);
      }
    }
  };

  return { results, loading, keyword, onChange: setKeyword, onSelect };
};
