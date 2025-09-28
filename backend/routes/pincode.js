import express from "express";
import PinCodeArea from "../models/PinCodeArea.js";

const router = express.Router();

// Lightweight in-memory cache for searched pincodes
let pincodeCache = new Map();
let searchStats = {
  totalSearches: 0,
  cacheHits: 0,
  dbSearches: 0
};

// Fast pincode lookup function using MongoDB
const findPincode = async (pincode) => {
  searchStats.totalSearches++;
  
  // Check cache first
  if (pincodeCache.has(pincode)) {
    searchStats.cacheHits++;
    console.log(`✅ Cache hit for pincode ${pincode}`);
    return pincodeCache.get(pincode);
  }
  
  // Search in MongoDB
  console.log(`🔍 Searching for pincode ${pincode} in database...`);
  searchStats.dbSearches++;
  
  const startTime = Date.now();
  
  try {
    // Find all records matching the pincode
    const records = await PinCodeArea.find({ pincode: parseInt(pincode) })
      .select('cityname areaname distrcitname statename')
      .lean(); // Use lean() for better performance
    
    const endTime = Date.now();
    
    if (records.length > 0) {
      // Group areas by city and district
      const result = {
        state: records[0].statename,
        cities: {}
      };
      
      // Group by city, then by district
      records.forEach(record => {
        const city = record.cityname;
        const district = record.distrcitname;
        const area = record.areaname;
        
        if (!result.cities[city]) {
          result.cities[city] = {
            districts: {}
          };
        }
        
        if (!result.cities[city].districts[district]) {
          result.cities[city].districts[district] = {
            areas: []
          };
        }
        
        // Add area if not already present (simplified - just name)
        if (!result.cities[city].districts[district].areas.some(a => a.name === area)) {
          result.cities[city].districts[district].areas.push({
            name: area
          });
        }
      });
      
      // Sort areas alphabetically
      Object.keys(result.cities).forEach(city => {
        Object.keys(result.cities[city].districts).forEach(district => {
          result.cities[city].districts[district].areas.sort((a, b) => 
            a.name.localeCompare(b.name)
          );
        });
      });
      
      // Cache the result
      pincodeCache.set(pincode, result);
      
      console.log(`✅ Found pincode ${pincode} in ${endTime - startTime}ms (${records.length} records)`);
      return result;
    } else {
      console.log(`❌ Pincode ${pincode} not found after ${endTime - startTime}ms search`);
      return null;
    }
  } catch (error) {
    console.error('❌ Error searching for pincode:', error);
    return null;
  }
};

// GET city, state, districts, and areas from pincode
router.get("/:pin", async (req, res) => {
  const startTime = Date.now();
  
  try {
    const pin = req.params.pin;
    
    // Validate pincode format
    if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      return res.status(400).json({ 
        error: "Invalid pincode format. Please enter a 6-digit pincode." 
      });
    }
    
    const result = await findPincode(pin);
    const responseTime = Date.now() - startTime;
    
    if (!result) {
      return res.status(404).json({ 
        error: "Pincode not found in our database." 
      });
    }
    
    // Calculate total areas count
    let totalAreas = 0;
    Object.keys(result.cities).forEach(city => {
      Object.keys(result.cities[city].districts).forEach(district => {
        totalAreas += result.cities[city].districts[district].areas.length;
      });
    });
    
    return res.json({ 
      state: result.state,
      cities: result.cities,
      totalAreas: totalAreas,
      totalCities: Object.keys(result.cities).length,
      responseTime: `${responseTime}ms`,
      cached: pincodeCache.has(pin)
    });
    
  } catch (err) {
    console.error('❌ Error in pincode lookup:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET simplified response for backward compatibility (returns first city/district)
router.get("/:pin/simple", async (req, res) => {
  const startTime = Date.now();
  
  try {
    const pin = req.params.pin;
    
    // Validate pincode format
    if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      return res.status(400).json({ 
        error: "Invalid pincode format. Please enter a 6-digit pincode." 
      });
    }
    
    const result = await findPincode(pin);
    const responseTime = Date.now() - startTime;
    
    if (!result) {
      return res.status(404).json({ 
        error: "Pincode not found in our database." 
      });
    }
    
    // Get first city and district for backward compatibility
    const firstCity = Object.keys(result.cities)[0];
    const firstDistrict = Object.keys(result.cities[firstCity].districts)[0];
    const areas = result.cities[firstCity].districts[firstDistrict].areas.map(a => a.name);
    
    return res.json({ 
      state: result.state,
      city: firstCity,
      district: firstDistrict,
      areas: areas,
      totalOffices: areas.length,
      responseTime: `${responseTime}ms`,
      cached: pincodeCache.has(pin)
    });
    
  } catch (err) {
    console.error('❌ Error in pincode lookup:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check endpoint
router.get("/health/check", (req, res) => {
  res.json({ 
    status: "OK", 
    cachedPincodes: pincodeCache.size,
    searchStats: searchStats,
    cacheHitRate: searchStats.totalSearches > 0 ? 
      ((searchStats.cacheHits / searchStats.totalSearches) * 100).toFixed(2) + '%' : 
      '0%'
  });
});

// Clear cache endpoint (for testing)
router.delete("/cache/clear", (req, res) => {
  const oldSize = pincodeCache.size;
  pincodeCache.clear();
  searchStats = {
    totalSearches: 0,
    cacheHits: 0,
    dbSearches: 0
  };
  
  res.json({ 
    message: "Cache cleared successfully",
    previousCacheSize: oldSize
  });
});

// Get cache info
router.get("/cache/info", (req, res) => {
  const cachedPincodes = Array.from(pincodeCache.keys());
  
  res.json({
    cacheSize: pincodeCache.size,
    cachedPincodes: cachedPincodes.slice(0, 20), // Show first 20
    totalCached: cachedPincodes.length,
    searchStats: searchStats
  });
});

export default router;