const express = require('express');
const router = express.Router();
const Post = require("../schemas/post.js");
const Comment = require("../schemas/comment.js");

//db의 댓글 목록 불러오기//
router.get("/posts/:id/comments", async (req, res) => {
    postId = req.params.id
    //게시판 아이디가 일치하는지 확인//
    const comments = await Comment.find({ postId })
    //일치한다면 if구문 일치하지 않는다면 else//
    if (comments.length) {
        const commentList = comments.map((comment) => {
            //db의 오브젝트 아이디를 문자열로 변환//
            commentId = String(comment._id)
            return {
                "commentId": commentId,
                "user": comment.user,
                "content": comment.content,
                "day": comment.day,
            }
        })
        res.send({ commentList })
    } else { return res.status(400).json({ message: "데이터 형식을 확인해주세요" }) }
});

//댓글 형성//
router.post("/posts/:id/comments", async (req, res) => {
    postId = req.params.id;
    //게시판의 id가 유효한 id인지 확인//
    const chkId = Post.find({ _id: Object(postId) })
    if (chkId) { console.log("게시판 특정 완료.") } else { return res.status(400).json({ message: "데이터형식을 확인해주세요" }) }
    //body에서 데이터 받음//
    const { content, user, password } = req.body;
    //작성 시간 설정//
    const day = new Date();
    //중복 아이디 확인 있다면 else로 없다면 if 구문//
    const existsUser = await Comment.find({ user });
    if (existsUser.length === 0) {
        //데이터를 작성했는지 확인//
        if (user) {
            //데이터를 작성했는지 확인//
            if (content) {
                //데이터를 작성했는지 확인//
                if (password) {
                    //데이터를 작성했는지 확인//
                    await Comment.create({ content, user, password, day, postId });
                    res.json({ message: "댓글을 생성하였습니다." })
                } else { return res.status(400).json({ message: "데이터형식을 확인해주세요" }) }
            } else { return res.status(400).json({ message: "데이터형식을 확인해주세요" }) }
        } else { return res.status(400).json({ message: "데이터형식을 확인해주세요" }) }
    } else { return res.status(400).json({ message: "이미 존재하는 user입니다." }) }
}
);

//댓글 데이터 수정//
router.put("/posts/:id/comments/:commentId", async (req, res) => {
    commentId = req.params.commentId;
    //body에서 데이터 받음//
    const { content, password } = req.body;
    //url의 title이 있는지 확인//
    const [existsComment] = await Comment.find({ _id: Object(commentId) });

    if (existsComment) {
        //데이터를 작성했는지 확인//
        if (content) {
            //비밀번호를 제대로 작성했는지 확인//
            if (existsComment.password != password) {
                return res.status(400).json({ message: "데이터형식을 확인해주세요" })
            } else {
                await Comment.updateOne({ _id: Object(commentId) }, { $set: { content } })
            }
        } else { return res.status(400).json({ message: "데이터형식을 확인해주세요" }) }
    } else { return res.status(400).json({ message: "게시글 조회에 실패했습니다." }) }
    res.json({ message: "게시글을 수정하였습니다." })

})

//게시글 삭제//
router.delete("/posts/:id/comments/:commentId", async (req, res) => {
    commentId = req.params.commentId;
    //body에서 데이터 받음//
    const { password } = req.body;
    //url의 title이 있는지 확인//
    const [existsComment] = await Comment.find({ _id: Object(commentId) });

    //url의 title이 없다면 else로 있다면 if구문//
    if (existsComment) {
        //비밀번호를 제대로 작성했는지 확인//
        if (existsComment.password != password) {
            return res.status(400).json({ message: "데이터형식을 확인해주세요" })
        } else { await Comment.deleteOne({ _id: Object(commentId) }) }
    } else { return res.status(400).json({ message: "게시글 조회에 실패했습니다." }) }
    res.json({ message: "게시글을 삭제해였습니다." });
});

module.exports = router;