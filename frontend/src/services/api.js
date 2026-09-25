const API_URL = "http://localhost:3000"; // update once the backend team confirms the port

export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

export async function getExercises() {
  const response = await fetch(`${API_URL}/exercises`);
  return response.json();
}

export async function getExerciseById(id) {
  const response = await fetch(`${API_URL}/exercises/${id}`);
  return response.json();
}