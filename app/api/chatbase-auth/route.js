export async function query(data) {
    const response = await fetch(
      "https://cloud.flowiseai.com/api/v1/prediction/dc74fc1a-37a6-4004-9338-2f03c0c1744e",
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
