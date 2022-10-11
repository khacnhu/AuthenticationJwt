/// Cái verify này như phân quyền 


const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log("token: " + token)
    jwt.verify(token, "secretkeyaccesstoken", (err, user) => {
      if (err) res.status(403).json("Token này không có giá trị");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};


//Cái này chỉ phân quyền khi là người đó id của người đó chã hạn hay là người đó là user Admin cũng được làm mọi thứ
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};


// cái này chỉ dành phân quyền cho mỗi Admin: true có nghĩa là khi admin mới có quyền xóa, sửa mọi thứ
// hoặc là admin getAll tất cả các sản phẩm hay user gì đó ra..... vâng vâng
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};