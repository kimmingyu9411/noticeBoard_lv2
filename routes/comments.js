const express = require('express');
const router = express.Router();
const Post = require("../schemas/post.js");
const Comment = require("../schemas/comment.js");
const User = require("../schemas/user");
const loginMiddleware = require("../middlewares/login-middleware")

router.get("/posts/:id/comments", async (req, res) => {
    postId = req.params.id
    const comments = await Comment.find({ postId })
    if (comments.length) {
        const commentList = comments.map((comment) => {
            commentId = String(comment._id)
            return {
                "commentId": commentId,
                "postId": comment.postId,
                "nickname": comment.nickname,
                "content": comment.content,
                "day": comment.day,
                "update": comment.update
            }
        });
        res.send({ commentList })
    } else { return res.status(400).json({ message: "데이터 형식을 확인해주세요" }) }
});


router.post("/posts/:id/comments", loginMiddleware, async (req, res) => {
    postId = req.params.id;
    const { userId } = res.locals.user;
    const { content } = req.body;
    const day = new Date();
    const update = new Date();
    const [existsUser] = await User.find({ _id: Object(userId) })
    const existsPost = await Post.find({ userId, _id: Object(postId) });
    const nickname = existsUser.nickname
    if (!existsPost) {
        res.status(403).json({ message: '전달된 쿠키에서 오류가 발생하였습니다.' })
        return
    }

    if (!content) {
        res.status(412).json({ message: '댓글 내용의 형식이 일치하지 않습니다.' })
        return
    }
    else {
        await Comment.create({ content, day, update, userId, nickname, postId });
        res.status(201).json({ massage: "댓글을 생성하였습니다." });
    }
});

router.put("/posts/:id/comments/:commentId", loginMiddleware, async (req, res) => {
    commentId = req.params.commentId;
    const { userId } = res.locals.user;
    const { content } = req.body;

    const [existsComment] = await Comment.find({ userId, _id: Object(commentId) });
    if (!existsComment) {
        res.status(412).json({ message: '댓글 내용의 형식이 일치하지 않습니다.' })
        return
    } else { await Comment.updateOne({ userId }, { $set: { content } }) }
    res.status(201).json({ message: "댓글을 수정하였습니다." })
});

//게시글 삭제//
router.delete("/posts/:id/comments/:commentId", loginMiddleware, async (req, res) => {
    commentId = req.params.commentId;
    const { userId } = res.locals.user;
    const [existsComment] = await Comment.find({ userId, _id: Object(commentId) });

    if (!existsComment) {
        return res.status(400).json({ message: "삭제권한이 없습니다." })
    } else { await Comment.deleteOne({ userId}) } 

    res.status(201).json({ message: "게시글을 삭제해였습니다." })
});

module.exports = router;