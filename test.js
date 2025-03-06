// Get the current date
const currentDate = new Date()

// Instantiate another date object to avoid mutating the current date object
const pastDate = new Date(currentDate)
pastDate.setDate(pastDate.getDate() - 365)
console.log(pastDate)
