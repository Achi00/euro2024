// bgRemoval.ts
import axios from "axios";

export const removeBackground = async (
  image: File
): Promise<{ success: boolean; processedImage: Blob | null }> => {
  try {
    const formData = new FormData();
    formData.append("image", image);

    const options = {
      method: "POST",
      url: "https://background-removal4.p.rapidapi.com/v1/results",
      params: { mode: "fg-image" },
      headers: {
        "X-RapidAPI-Key": "58c426e3c1mshda957fec22c00e5p12d1e5jsne41977590af6",
        "X-RapidAPI-Host": "background-removal4.p.rapidapi.com",
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    };

    const response = await axios.request(options);

    if (
      response.data.results &&
      response.data.results[0].entities &&
      response.data.results[0].entities[0].image
    ) {
      const base64Image = response.data.results[0].entities[0].image;

      // Convert base64 to Blob
      const byteCharacters = atob(base64Image);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const processedImageBlob = new Blob([byteArray], { type: "image/png" });

      return { success: true, processedImage: processedImageBlob };
    } else {
      return { success: false, processedImage: null };
    }
  } catch (error) {
    console.error("Background removal failed:", error);
    return { success: false, processedImage: null };
  }
};
