const users = [
  {
    id: 1,
    name: "Rebekah Johnson",
    email: "Glover12345@gmail.com",
    password: "123qwe",
  },
  {
    id: 2,
    name: "Fabian Predovic",
    email: "Connell29@gmail.com",
    password: "password",
  },
];

const posts = [
  {
    id: 1,
    title: "간단한 HTTP API 개발 시작!",
    content: "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현.",
    userId: 1,
  },
  {
    id: 2,
    title: "HTTP의 특성",
    content: "Request/Response와 Stateless!!",
    userId: 2,
  },
];

// 아래에 코드를 작성해 주세요.
const http = require("http");
const { isBooleanObject } = require("util/types");
const server = http.createServer();

const httpRequestListener = function (request, response) {
  const { url, method } = request;

  if (method === "GET") {
    if (url === "/ping") {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ message: "pong" }));
    }
    if (method === "GET") {
      if (url === "/posts_list") {
        const data = [];

        //1. users 객체의 각 인덱스 값 가져오기
        //2. posts 객체의 각 인덱스 값 가져오기
        //3. user.id와 post.userId가 같은지 조건문
        //4. 3번조건문(true)일때에 data 배열에 push
        //  -> 객체구조 생성후 data배열에 push해야함.
        for (let n in users) {
          for (let m in posts) {
            if (users[n].id === posts[m].userId) {
              const obj = {};
              obj.userID = users[n].id;
              obj.userName = users[n].name;
              obj.postingId = posts[m].id;
              obj.postingTitle = posts[m].title;
              obj.postingContent = posts[m].content;

              data.push(obj);
            }
          }
        }

        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ data: data }));
      }
    }
    if (method === "GET") {
      if (url === "/user_posts") {
        const data = {};
        let body = "";

        request.on("data", (data) => {
          body += data;
        });
        request.on("end", () => {
          const dataForUserPost = JSON.parse(body);

          for (let n in users) {
            if (users[n].id === Number(dataForUserPost.id)) {
              const postingsArr = [];

              for (let m in posts) {
                if (posts[m].userId === Number(dataForUserPost.id)) {
                  const postingObj = {};

                  postingObj.postingId = posts[m].id;
                  postingObj.postingName = posts[m].title;
                  postingObj.postingContent = posts[m].content;

                  postingsArr.push(postingObj);
                }
              }
              data.userID = users[n].id;
              data.userName = users[n].name;
              data.postings = postingsArr;
            }
          }

          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ data: data }));
        });
      }
    }
  } else if (method === "POST") {
    if (url === "/users/signup") {
      let body = "";

      request.on("data", (data) => {
        body += data;
      });

      request.on("end", () => {
        const user = JSON.parse(body); //body를 JSON.parse() 함수에 돌려서 Json 데이터를 자바스크립트의 object로 변환.

        users.push({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
        });
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "userCreated" }));
      });
    } else if (url === "/posts") {
      let body = "";

      request.on("data", (data) => {
        body += data;
      });

      request.on("end", () => {
        const post = JSON.parse(body);

        posts.push({
          id: post.id,
          title: post.title,
          content: post.content,
          userId: post.userId,
        });
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "postCreated" }));
      });
    }
  } else if (method === "PATCH") {
    if (url === "/posts_modify") {
      let body = "";

      request.on("data", (data) => {
        body += data;
      });
      request.on("end", () => {
        const dataForModify = JSON.parse(body);
        for (let i in posts) {
          if (
            posts[i].id === Number(dataForModify.id) &&
            posts[i].userId === Number(dataForModify.userid)
          ) {
            posts[i].content = dataForModify.content;
          }
        }
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ posts: posts }));
      });
    }
  } else if (method === "DELETE") {
    if (url === "/posts_delete") {
      let body = "";

      request.on("data", (data) => {
        body += data;
      });
      request.on("end", () => {
        const dataForDelete = JSON.parse(body);
        //console.log("dataForModify, ", dataForModify);

        for (let i in posts) {
          if (
            posts[i].id === Number(dataForDelete.id) &&
            posts[i].userId === Number(dataForDelete.userid)
          ) {
            posts.splice(i, 1);
          }
        }
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ posts: posts }));
      });
    }
  }
};

server.on("request", httpRequestListener);

const IP = "127.0.0.1";
const PORT = 8000;

server.listen(PORT, IP, function () {
  console.log(`Listening to request on ip ${IP} & port ${PORT}`);
});
