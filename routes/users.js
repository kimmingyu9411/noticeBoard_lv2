const express = require("express");
const router = express.Router();
const User = require("../schemas/user");

// 회원가입 API
router.post("/signup", async (req, res) => {
    const { Id, nickname, password, confirmPassword } = req.body
    if (password !== confirmPassword) {
        res.status(400).json({
            errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
        });
        return;
    }


    // email 또는 nickname이 동일한 데이터가 있는지 확인하기 위해 가져온다.
    const existsUsers = await User.findOne({
        $or: [{ Id }, { nickname }],
    });
    if (existsUsers) {
        // NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않습니다.
        res.status(400).json({
            errorMessage: "이메일 또는 닉네임이 이미 사용중입니다.",
        });
        return;
    }

    if (password.indexOf(Id) !== -1) {
        res.status(400).json({
            errorMessage: "비밀번호에 닉네임을 포함하고 있습니다.",
        });
        return;
    }

    const user = new User({ Id, nickname, password });
    await user.save();

    res.status(201).json({Message: "회원가입에 성공했습니다."});
});


module.exports = router;