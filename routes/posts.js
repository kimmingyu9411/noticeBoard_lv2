const express = require('express');
const router = express.Router();
const Post = require("../schemas/post.js");
const loginMiddleware = require("../middlewares/login-middleware");


//db의 게시글 전체 목록 불러오기//
router.get("/posts", async (req, res) => {
  const posts = await Post.find({})
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
  if ([existsPost].length) {
    const searchReslut = [existsPost].map((search) => {
      return {
        "postId": id,
        "title": search.title,
        "content": search.content,
        "user": search.user,
        "day": search.day
      }
    })
    res.json({ searchReslut });
  } else { return res.status(400).json({ message: "데이터형식을 확인해주세요" }) }

});

//게시글 형성//
router.post("/posts",loginMiddleware, async (req, res) => {
  //body에서 데이터 받음//
  const { title, content, user, password } = req.body;
  //작성 시간 설정//
  const day = new Date();
  //중복 아이디 확인 있다면 else로 없다면 if 구문//
  const existsUser = await Post.find({ user });
  if (existsUser.length === 0) {
    //데이터를 작성했는지 확인//
    if (title) {
      //데이터를 작성했는지 확인//
      if (content) {
        //데이터를 작성했는지 확인//
        if (user) {
          //데이터를 작성했는지 확인//
          if (password) {
            await Post.create({ title, content, user, password, day });
            res.json({ message: "게시판을 생성하였습니다." })
          } else { return res.status(400).json({ message: "데이터형식을 확인해주세요" }) }
        } else { return res.status(400).json({ message: "데이터형식을 확인해주세요" }) }
      } else { return res.status(400).json({ message: "데이터형식을 확인해주세요" }) }
    } else { return res.status(400).json({ message: "데이터형식을 확인해주세요" }) }
  } else { return res.status(400).json({ message: "이미 존재하는 user입니다." }) }
}
);

//게시글 데이터 수정//
router.put("/posts/:id",loginMiddleware, async (req, res) => {
  id = req.params.id;
  //body에서 데이터 받음//
  const { content, password } = req.body;
  //url의 title이 있는지 확인//
  const [existsPost] = await Post.find({ _id: Object(id) });

  //url의 title이 존재한다면 if구문 없다면 else로//
  if (existsPost) {
    //데이터를 작성했는지 확인//
    if (content) {
      //비밀번호를 제대로 작성했는지 확인//
      if (existsPost.password != password) {
        return res.status(400).json({ message: "데이터형식을 확인해주세요" })
      } else {
        await Post.updateOne({ _id: Object(id) }, { $set: { content } })
      }
    } else { return res.status(400).json({ message: "데이터형식을 확인해주세요" }) }
  } else { return res.status(400).json({ message: "게시글 조회에 실패했습니다." }) }
  res.json({ message: "게시글을 수정하였습니다." })
})

//게시글 삭제//
router.delete("/posts/:id",loginMiddleware, async (req, res) => {
  id = req.params.id;
  //body에서 데이터 받음//
  const { password } = req.body;
  //url의 title이 있는지 확인//
  const [existsPost] = await Post.find({ _id: Object(id) });

  //url의 title이 없다면 else로 있다면 if구문//
  if (existsPost) {
    //비밀번호를 제대로 작성했는지 확인//
    if (existsPost.password != password) {
      return res.status(400).json({ message: "데이터형식을 확인해주세요" })
    } else { await Post.deleteOne({ _id: Object(id) }) }
  } else { return res.status(400).json({ message: "게시글 조회에 실패했습니다." }) }
  res.json({ message: "게시글을 삭제해였습니다." });
})


module.exports = router;