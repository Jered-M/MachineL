const BASE_URL = "https://ml-api-3jf9.onrender.com";

export const recognizeFaceAPI = async (base64Image) => {
  try {
    const response = await fetch(`${BASE_URL}/recognize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: base64Image }),
    });

    return await response.json();
  } catch (error) {
    console.error("Erreur API:", error);
    return { error: "API unreachable" };
  }
};
