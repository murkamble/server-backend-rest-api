const jwt = require('jsonwebtoken')

var multerS3 = require('multer-s3')
var aws = require('aws-sdk')

const multer = require('multer');
const shortid = require('shortid');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cd) {
        cd(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename: function(req, file, cd) {
        cd(null, shortid.generate() + '-' + file.originalname)
    }
})

exports.upload = multer({ storage });

var s3 = new aws.S3({
    accessKeyID: "AKIAZ22LFMUC3HVRWX2N",
    secretAccessKey: "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"
})

exports.uploadS3 = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'bazaar-clone-bucket',
      acl: "public-read",
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, shortid.generate() + '-' + file.originalname)
      }
    })
  })


exports.requireSignin = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1]
        const user = jwt.verify(token, process.env.JWT_SECRET)
        req.user = user        
    }else{
        return res.status(400).json({ message: 'Authorization required.' })
    }
    next()
}


exports.userMiddleware = (req, res, next) => {
    if (req.user.role !== 'user') {
        return res.status(400).json({ message: 'User Access denied.' })
    }
    next()
}


exports.adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(400).json({ message: 'Admin Access denied.' })
    }
    next()
}