const express = require("express")
const path = require("path")
const fs = require("fs").promises

const app = express()
const PORT = 3000

const dataDir = path.join(__dirname, "data")
const usersFile = path.join(dataDir, "users.json")
const postsFile = path.join(dataDir, "posts.json")
const galleryDir = path.join(__dirname, "public", "gallery")

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))

app.use((req, res, next) => {
  const start = process.hrtime.bigint()
  res.on("finish", () => {
    const diff = Number(process.hrtime.bigint() - start) / 1e6
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${diff.toFixed(2)} ms`)
  })
  next()
})

async function readJson(file, fallback) {
  try {
    const data = await fs.readFile(file, "utf-8")
    return JSON.parse(data)
  } catch (err) {
    return fallback
  }
}

async function writeJson(file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2))
}

app.get("/", (req, res) => {
  res.render("index", { view: "home" })
})

app.get("/users", async (req, res) => {
  const users = await readJson(usersFile, [])
  const name = (req.query.name || "").trim()
  const filtered = name
    ? users.filter((u) => u.name.toLowerCase().includes(name.toLowerCase()))
    : users
  res.render("index", { view: "users", users: filtered, query: { name } })
})

app.get("/contact", (req, res) => {
  const sent = req.query.sent === "1"
  res.render("index", { view: "contact", sent })
})

app.post("/contact", (req, res) => {
  res.redirect("/contact?sent=1")
})

app.get("/gallery", async (req, res) => {
  let images = []
  try {
    const files = await fs.readdir(galleryDir)
    images = files.filter((f) => /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(f))
  } catch (err) {
    images = []
  }
  res.render("index", { view: "gallery", images })
})

app.get("/blog", async (req, res) => {
  const posts = await readJson(postsFile, [])
  const sorted = posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date))
  res.render("index", { view: "blog-list", posts: sorted })
})

app.get("/blog/new", (req, res) => {
  res.render("index", { view: "blog-new" })
})

app.post("/blog", async (req, res) => {
  const posts = await readJson(postsFile, [])
  const title = (req.body.title || "").trim()
  const body = (req.body.body || "").trim()
  if (!title || !body) {
    return res.redirect("/blog/new")
  }
  const post = {
    id: Date.now().toString(36),
    title,
    body,
    date: new Date().toISOString()
  }
  posts.push(post)
  await writeJson(postsFile, posts)
  res.redirect(`/blog/${post.id}`)
})

app.get("/blog/:id", async (req, res) => {
  const posts = await readJson(postsFile, [])
  const post = posts.find((p) => p.id === req.params.id)
  if (!post) {
    return res.status(404).render("index", { view: "404" })
  }
  res.render("index", { view: "blog-view", post })
})

app.use((req, res) => {
  res.status(404).render("index", { view: "404" })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
