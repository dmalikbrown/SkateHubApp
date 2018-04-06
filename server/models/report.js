const mongoose = require('mongoose');
const Spot = require('./spot');
const User = require('./user');
// Report Schema
const ReportSchema = mongoose.Schema(
  {
    userId: { type: String },
    spotId: { type: String },
    report: [
        {type: String}
        //TODO add date sent
    ],
  } , { timestamps: { createdAt: 'created_at' } });

const Report = module.exports = mongoose.model('Report', ReportSchema);

module.exports.getReportById = function(id, callback){
  Report.findById(id, callback);
}

module.exports.addReport = function(newReport, callback){
  console.log(newReport);
  newReport.save(callback);
}
