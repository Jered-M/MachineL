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

export const registerFaceAPI = async (name, base64Image) => {
  try {
    console.log(`📝 Enregistrement du visage: ${name}`);
    
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        name: name,
        image: base64Image 
      }),
    });

    const data = await response.json();
    console.log("✅ Visage enregistré:", data);
    return data;
  } catch (error) {
    console.error("Erreur enregistrement:", error);
    return { error: "Cannot register face" };
  }
};

export const getEmployeesAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}/employees`);
    return await response.json();
  } catch (error) {
    console.error("Erreur récupération employés:", error);
    return { error: "API unreachable" };
  }
};
