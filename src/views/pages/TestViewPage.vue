<template>
  <div>
    <button @click="exportToExcel">Export to Excel</button>
  </div>
</template>

<script>
import * as XLSX from "xlsx";

export default {
  methods: {
    exportToExcel() {
      // Sample JSON data for the first table (Customers)
      const jsonDataTable1 = [
        { name: "John Doe", age: 28, city: "" },
        { name: "Jane Smith", age: 32, city: "London" },
        { name: "Sam Green", age: 22, city: "Sydney" }
      ];

      // Sample JSON data for the second table (Products)
      const jsonDataTable2 = [
        { product: "Laptop", price: 999, stock: 50 },
        { product: "Smartphone", price: 699, stock: 100 },
        { product: "Headphones", price: 150, stock: 200 }
      ];

      // Convert JSON data for both tables into worksheets (combined into one sheet)
      const ws = XLSX.utils.json_to_sheet(jsonDataTable1);

      // Add a visual separation for the second table (Products)
      const startRow = jsonDataTable1.length + 4; // Adding a couple of empty rows between tables
      const ws2 = XLSX.utils.json_to_sheet(jsonDataTable2);
      
      // Merge both worksheets into one by adding ws2 below ws
      XLSX.utils.sheet_add_json(ws, jsonDataTable2, { origin: `A${startRow}` });

      // Create a new workbook and add the combined sheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Combined Data");

      // Write the workbook to an Excel file
      XLSX.writeFile(wb, "data_combined_in_one_sheet.xlsx");
    }
  }
};
</script>
