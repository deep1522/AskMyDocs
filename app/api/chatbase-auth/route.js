export async function query(data) {
    const response = await fetch(
      "http://localhost:3000/api/v1/prediction/35c5f3ff-f066-4114-a431-d9c42c62245e",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  }
