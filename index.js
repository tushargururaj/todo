import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

// var
var masterArray = [];
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "todo",
  password: "tgrs2316",
  port: 5432,
});
db.connect();

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req,res) => {
  await fetchData();
  res.render("index.ejs", {data: masterArray})
});

app.post("/add", async (req, res) => {
  const { task } = req.body;
  try {
    await db.query("INSERT INTO tasks (tasks, completed) VALUES ($1, $2)", [task, 0]);
    console.log("success");
  } catch (err) {
    console.error(err);
  }
  res.redirect("/");
});

app.post("/delete/:id", async (req,res) => {
 const {id} = req.params;
  try {
    await db.query("DELETE FROM tasks WHERE id=$1;", [id]);
    console.log("success");
  } catch (err) {
    console.error(err);
  }
  res.redirect("/")
});

app.post("/toggle/:id", async (req,res) => {
 const {id} = req.params;
  try {
    await db.query("UPDATE tasks SET completed = NOT completed WHERE id = $1;", [id]);
    console.log("success");
  } catch (err) {
    console.error(err);
  }
  res.redirect("/")
});

app.post("/edit/:id", async (req,res) => {
  const {id} = req.params;
  try {
    await db.query("UPDATE tasks SET editing = NOT editing WHERE id=$1;",[id]);
    console.log("sucess");
  } catch(err){
    console.error(err);
  }
  res.redirect("/")
  })

  app.post("/edited/:id", async (req,res) => {
  const {id} = req.params;
  const {task} = req.body;
  try {
    await db.query("UPDATE tasks SET tasks = $2, editing = FALSE WHERE id=$1;",[id,task]);
    console.log("sucess");
  } catch(err){
    console.error(err);
  }
  res.redirect("/")
  })

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


async function fetchData(){
  try {
    const result = await db.query("SELECT * from tasks");
      masterArray = result.rows;
      console.log(masterArray);
  } catch (err) {
    console.error(err);
    console.log("FUCK DB");
  }
};


