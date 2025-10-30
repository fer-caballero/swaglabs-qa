// Function to get current date and time in a formatted string
function getCurrentDateTime() {
  const now = new Date();
  
  // Format date components
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  // Format time components
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  // Return ISO 8601 format
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

// Example usage
console.log('Current date/time:', getCurrentDateTime());
