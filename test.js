const mongoose = require("mongoose");
const BlogPost = require("./src/models/blogPost.js");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1/my_blog");
  console.log("Connected!");

  await BlogPost.deleteMany({ title: "My first blog post" });

  const blogPost = await BlogPost.create({
    title: "My first blog post",
    body: "This is the content of my first blog post",
  });
  console.log("Blog post created:", blogPost);

  await mongoose.connection.close();
  console.log("Connexion fermée — article visible sur http://localhost:3000/");
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
