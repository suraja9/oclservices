import mongoose from "mongoose";

const pinCodeAreaSchema = new mongoose.Schema({
  cityname: {
    type: String,
    required: true,
    trim: true
  },
  areaname: {
    type: String,
    required: true,
    trim: true
  },
  pincode: {
    type: Number,
    required: true,
    min: 100000,
    max: 999999
  },
  distrcitname: { // Keeping the typo as it exists in your database
    type: String,
    required: true,
    trim: true
  },
  statename: {
    type: String,
    required: true,
    trim: true
  },
  delivery: {
    type: String,
    enum: ['Delivery', 'Non-Delivery'],
    default: 'Delivery'
  }
}, {
  timestamps: false, // Since this is reference data, we don't need timestamps
  collection: 'Pin_Code_Area' // Match your existing collection name
});

// Create indexes for better query performance
pinCodeAreaSchema.index({ pincode: 1 }); // Primary search index
pinCodeAreaSchema.index({ pincode: 1, cityname: 1 }); // Compound index
pinCodeAreaSchema.index({ statename: 1 }); // State-wise queries
pinCodeAreaSchema.index({ cityname: 1 }); // City-wise queries

// Static method to find areas by pincode with grouping
pinCodeAreaSchema.statics.findByPincodeGrouped = function(pincode) {
  return this.aggregate([
    { $match: { pincode: parseInt(pincode) } },
    {
      $group: {
        _id: {
          state: '$statename',
          city: '$cityname',
          district: '$distrcitname'
        },
        areas: {
          $push: {
            name: '$areaname',
            delivery: { $eq: ['$delivery', 'Delivery'] }
          }
        }
      }
    },
    {
      $group: {
        _id: {
          state: '$_id.state',
          city: '$_id.city'
        },
        districts: {
          $push: {
            name: '$_id.district',
            areas: '$areas'
          }
        }
      }
    },
    {
      $group: {
        _id: '$_id.state',
        cities: {
          $push: {
            name: '$_id.city',
            districts: '$districts'
          }
        }
      }
    }
  ]);
};

// Static method to get unique cities for a pincode
pinCodeAreaSchema.statics.getCitiesByPincode = function(pincode) {
  return this.distinct('cityname', { pincode: parseInt(pincode) });
};

// Static method to get unique districts for a pincode and city
pinCodeAreaSchema.statics.getDistrictsByPincodeCity = function(pincode, cityname) {
  return this.distinct('distrcitname', { 
    pincode: parseInt(pincode), 
    cityname: cityname 
  });
};

// Static method to get areas for pincode, city, and district
pinCodeAreaSchema.statics.getAreasByPincodeLocation = function(pincode, cityname, districtname) {
  return this.find({ 
    pincode: parseInt(pincode), 
    cityname: cityname,
    distrcitname: districtname
  }).select('areaname delivery').lean();
};

// Virtual for formatted address
pinCodeAreaSchema.virtual('fullAddress').get(function() {
  return `${this.areaname}, ${this.cityname}, ${this.distrcitname}, ${this.statename} - ${this.pincode}`;
});

// Ensure virtual fields are serialized
pinCodeAreaSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model("PinCodeArea", pinCodeAreaSchema);