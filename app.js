const express = require('express');
const ExpressError = require("./expressError")


const app = express();

const calculateMean = arr => arr.reduce((a,b) => a + b, 0) / arr.length;
function calculateMedian(arr) {
    const sorted = arr.sort((a, b) => a - b);
    const mid = Math.floor(arr.length / 2);
    return arr.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  };
function calculateMode(arr) {
    const freq = {};
    let maxCount = 0;
    let modeVal = null;
  
    for (const val of arr) {
      if (freq[val]) {
        freq[val]++;
      } else {
        freq[val] = 1;
      }
  
      if (freq[val] > maxCount) {
        maxCount = freq[val];
        modeVal = val;
      }
    }
    // Check if all frequencies are the same
    const isUniform = Object.values(freq).every(count => count === maxCount);
    return isUniform ? 'no mode value' : modeVal;
};
  
app.use((req, res, next) => {
    try {
      const {nums} = req.query
      if (!nums) {
        throw new ExpressError('nums are required', 400);
      }
      numsArray = (nums).split(',').map(num => {return +num});
      if (numsArray.includes(NaN)) {
        throw new ExpressError('You submitted a value that is not a number. You must only submit numbers.', 400);
      }
      req.query.numsArray = numsArray;
      next();
    } catch (err) {
      next(err);
    }
  
  })

  app.get('/mean', (req, res) => {
    const numsArray = req.query.numsArray;
    const mean = calculateMean(numsArray);
    res.send({operation: "mean", value: mean});
  })

app.get('/median', (req, res) => {
   const numsArray = req.query.numsArray;
   const median = calculateMedian(numsArray);
   res.send({operation: "median", value: median})
});

app.get('/mode', (req, res) => {
    const numsArray = req.query.numsArray;
    const mode = calculateMode(numsArray);
    res.send({operation:"mode", value: mode})
})

app.get('/all', (req, res) => {
    
})
  

app.use(function(err, req, res, next) {
    let status = err.status || 500;
    let message = err.message;
    // set the status and alert the user
    return res.status(status).json({
        error: {message, status}
    });
});

app.listen(3000, function () {
  console.log('App on port 3000');
})