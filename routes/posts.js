const express = require('express');
const router = express.Router();
const Post = require("../schemas/post.js");
const loginMiddleware = require("../middlewares/login-middleware")


//db의 게시글 전체 목록 불러오기//
router.get("/posts", async (req, res) => {
  const posts = await Post.find({}).sort({ day: -1 })
  //db의 게시글 데이터 중 표출 데이터 선정//
  const postList = posts.map((post) => {
    //db의 오브젝트 아이디를 문자열로 변환//
    postId = String(post._id)
    return {
      "postId": postId,
      "title": post.title,
      "user": post.user,
      "day": post.day,
    }
  })
  res.send({ postList });
});

//db의 특정 게시글, 게시글의 url을 id로 구분// 
router.get("/posts/:id", async (req, res) => {
  //id의 파라미터 설정//
  id = req.params.id;
  //id가 같은 데이터를 서치//
  const [existsPost] = await Post.find({ _id: Object(id) });
  //id와 같은 데이터가 없다면 else로 있다면 if구문//
  if (!existsPost) {
    return res.status(400).json({ message: "게시글 조회에 실패했습니다." })
  } else {
    const searchReslut = [existsPost].map((search) => {
      return {
        "postId": id,
        "userId": search.userId,
        "title": search.title,
        "content": search.content,
        "day": search.day,
        "update": search.update
      }
    })
    res.json({ searchReslut });
  }

});

//게시글 형성//
router.post("/posts", loginMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  //body에서 데이터 받음//
  const { title, content } = req.body;
  //작성 시간 설정//
  const day = new Date();
  const update = new Date();
  const existsUser = await Post.find({ userId });

  if (!existsUser) {
    res.status(403).json({ message: '전달된 쿠키에서 오류가 발생하였습니다.' })
    return
  }

  if (!title && !content) {
    res.status(412).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return
  }
  if (!title) {
    res.status(412).json({ message: '게시글 제목의 형식이 일치하지 않습니다.' })
    return
  }

  if (!content) {
    res.status(412).json({ message: '게시글 내용의 형식이 일치하지 않습니다.' })
    return
  }
  else {
    await Post.create({ title, content, day, userId, update });
    res.status(200).json({ massage: "게시글을 생성하였습니다." });
  }
});


//게시글 데이터 수정//
router.put("/posts/:id", loginMiddleware, async (req, res) => {
  id = req.params.id;
  const { title, content } = req.body;
  const { userId } = res.locals.user;
  const update = new Date();
  const [existsPost] = await Post.find({ userId,_id: Object(id)});
  if (!title) {
    res.status(412).json({ message: '게시글 제목의 형식이 일치하지 않습니다.' })
    return
  }

  if (!content) {
    res.status(412).json({ message: '게시글 내용의 형식이 일치하지 않습니다.' })
    return
  }

  if (!existsPost) {
    return res.status(412).json({ message: "게시글을 수정할 권한이 존재하지 않습니다." })
  } else {
    await Post.updateOne({ userId }, { $set: { update } })
    await Post.updateOne({ userId }, { $set: { content } });
    await Post.updateOne({ userId }, { $set: { title } });
    res.json({ message: "게시글을 수정하였습니다." })
  }
})

//게시글 삭제//
router.delete("/posts/:id", loginMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const [existsPost] = await Post.find({ userId });

  if (!existsPost) {
    return res.status(412).json({ message: "게시글을 삭제할 권한이 존재하지 않습니다." })
  } else { await Post.deleteOne({ userId }) }
  res.json({ message: "게시글을 삭제해였습니다." });
})


module.exports = router;