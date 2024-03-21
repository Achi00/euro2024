"use client";
import React, { useState } from "react";
import axios from "axios";

const page = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedImage(file);
  };

  const handleRemoveBackground = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("image", selectedImage);

    const options = {
      method: "POST",
      url: "https://background-removal4.p.rapidapi.com/v1/results",
      params: { mode: "fg-image" },
      headers: {
        "X-RapidAPI-Key": "532606fd5amshbfdbc1bd5ff8f44p190eb2jsnc5d1642e27ba",
        "X-RapidAPI-Host": "background-removal4.p.rapidapi.com",
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    };

    try {
      setLoading(true);
      const response = await axios.request(options);
      console.log("API Response Data:", response.data);

      const base64Image = response.data.results[0].entities[0].image;
      const imageUrl = `data:image/png;base64,${base64Image}`;
      setProcessedImage(imageUrl);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <h1>Remove Background</h1>
      <input type="file" onChange={handleImageUpload} />
      <button
        disabled={!selectedImage}
        className="bg-gray-400 p-2 rounded-lg"
        onClick={handleRemoveBackground}
      >
        Remove Background
      </button>
      {processedImage && <img src={processedImage} alt="Processed Image" />}
      {loading && <p className="text-4xl">Loading...</p>}
    </div>
  );
};

export default page;
