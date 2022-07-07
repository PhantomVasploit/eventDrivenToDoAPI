const jwt = require('jsonwebtoken');

module.exports.requireAuth = (req, res, next)=>{
  try {
    const bearerHeader = req.headers["authorization"];
    if(!bearerHeader){
      return res.status(401).json({message: `Authentication headers not set`});
    }else {
      const bearer = bearerHeader.split(' ');
      const token = bearer[1];
      if(!token){
        return res.status(401).json({message: 'Authntication token is unavailable'});
      }else {
        return jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken)=>{
          if(err){
            return res.status(511).json({message: `Invalid authentication token`});
          }
          if(decodedToken){
            req.userId = decodedToken._id;
            return next();
          }
        })
      }
    }
  } catch (e) {

  }
}
