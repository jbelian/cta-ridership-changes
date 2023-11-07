// import { ctaToken } from "./token.tsx";

// export const fetchData = async () => {
//   try {
//     const response = await fetch(
//       `https://data.cityofchicago.org/resource/bynn-gwxy.json?$limit=50000&$$app_token=${ctaToken}`
//     );

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const data = await response.json();
//     alert(`Retrieved ${data.length} records from the dataset!`);
//     console.log(data);

//     // Download the JSON data as a file
//     const jsonBlob = new Blob([JSON.stringify(data)], {
//       type: "application/json",
//     });
//     const url = URL.createObjectURL(jsonBlob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "data.json";
//     a.click();
//     URL.revokeObjectURL(url);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// };

// fetchData();
