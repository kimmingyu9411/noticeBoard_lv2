const express = require("express");
const router = express.Router();
const User = require("../schemas/user");
const jwt = require("jsonwebtoken");



//로그인API
router.post("/login", async (req, res) => {
    const {Id, password } = req.body;

    //아이디가 일치하는 유저를 찾는다.
    const user = await User.findOne({ Id });

    //1.아이디가 일치하는 유저가 존재하지 않거나
    //2.유저를 찾았지만 유저의 비밀번호와 입력한 비밀번호가 다를 때
    if (!user || user.password !== password) {
        res.status(400).json({
            errorMessage: "로그인에 실패하였습니다."
        });
  
        return;
    }
    //JWT를 생성
    const token = jwt.sign({ userId: user.userId }, "customized-secret-key");

    res.cookie("Authorization", `Bearer ${token}`);
    res.status(200).json({ token });

});

module.exports = router