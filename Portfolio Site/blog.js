import { customPrompt, confirm } from "./customdialog.js";

let blogPosts = [];
const postTemplate = () =>
  document.getElementById("post-template").content.cloneNode(true);
const postList = document.getElementById("post-list");
const openAdd = document.getElementById("open-add");

openAdd.addEventListener("click", () => {
  customPrompt(
    "add-post",
    (dialog) => {},
    (dialog) => {
      if(!dialog){
        return;
      }
      const title = dialog.querySelector(".title").value;
      const date = dialog.querySelector(".date").value;
      const summary = dialog.querySelector(".summary").value;
      addPost(title, date, summary);
    }
  );
});

window.onload = () => {
  blogPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
  updateView();
};

function createPost(title, date, summary) {
  return {
    title,
    date,
    summary,
  };
}

function makePost(
  { title, date, summary },
  template,
  deletePostHandler,
  updatePostHandler
) {
  template.querySelector(".title").textContent = title;
  template.querySelector(".date").textContent = date;
  template.querySelector(".summary").textContent = summary;
  template
    .querySelector(".delete")
    .addEventListener("click", deletePostHandler);
  template
    .querySelector(".update")
    .addEventListener("click", updatePostHandler);
  return template;
}

function addPost(title, date, summary) {
  const newPost = createPost(title, date, summary);
  blogPosts.push(newPost);
  update();
}

function updatePost(index, title, date, summary) {
  blogPosts[index] = createPost(title, date, summary);
  update();
}

function deletePost(index) {
  blogPosts.splice(index, 1);
  update();
}

function update() {
  updateLocalStorage();
  updateView();
}

function updateLocalStorage() {
  localStorage.setItem("blogPosts", JSON.stringify(blogPosts));
}

function updateView() {
  postList.innerHTML = "";
  for (let postIndex in blogPosts) {
    const post = blogPosts[postIndex];
    const newPostElement = makePost(
      post,
      postTemplate(),
      () =>
        confirm("Would you like to delete this post?", (confirmed) => {
          if (confirmed) {
            deletePost(postIndex);
          }
        }),
      () =>
        customPrompt(
          "edit-post",
          (dialog) => {
            dialog.querySelector(".title").value = post.title;
            dialog.querySelector(".date").value = post.date;
            dialog.querySelector(".summary").value = post.summary;
            dialog.querySelector(".index").value = postIndex;
          },
          (dialog) => {
            if (!dialog) {
              return;
            }
            const title = dialog.querySelector(".title").value;
            const date = dialog.querySelector(".date").value;
            const summary = dialog.querySelector(".summary").value;
            const index = dialog.querySelector(".index").value;
            updatePost(index, title, date, summary);
          }
        )
    );
    postList.appendChild(newPostElement);
  }
}
