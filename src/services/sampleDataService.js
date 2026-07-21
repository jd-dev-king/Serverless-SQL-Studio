export async function loadSampleCsv() {
  const response = await fetch(`${import.meta.env.BASE_URL}sample-data/sample_sales.csv`);

  if (!response.ok) {
    throw new Error("Could not load the sample dataset.");
  }

  return response.text();
}
