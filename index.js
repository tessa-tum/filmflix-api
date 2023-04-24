const express = require("express");
(morgan = require("morgan")), (fs = require("fs")), (path = require("path"));
(bodyParser = require("body-parser")), (uuid = require("uuid"));

const app = express();
app.use(bodyParser.json());

// list of sample users
let users = [
  {
    id: "1",
    name: "Gina",
    favoriteMovies: [],
  },
  {
    id: "2",
    name: "Zeke",
    favoriteMovies: ["The Woman King"],
  },
  {
    id: "3",
    name: "Taram",
    favoriteMovies: [],
  },
];

// list of sample movies
let movies = [
  {
    Title: "Everything Everywhere All At Once",
    Description:
      "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have led.",
    Director: {
      Name: "Daniel Kwan",
      Bio: 'Daniel Kwan with Daniel Scheinert, collectively known as Daniels, are a duo of film directors and writers. They began their career as directors of music videos, including the popular DJ Snake promotional for the single "Turn Down for What" (2013). They have since ventured into film, having written and directed the surreal comedy-drama Swiss Army Man (2016) and the science-fiction action comedy Everything Everywhere All at Once (2022), the latter became A24s highest-grossing film of all time.',
      Birth: 1988.0,
    },
    Genre: {
      Name: "Action",
      Description:
        "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats. The genre tends to feature a mostly resourceful hero struggling against incredible odds, which include life-threatening situations, a dangerous villain, or a pursuit which usually concludes in victory for the hero. ",
    },
    ImageURL:
      "https://www.imdb.com/title/tt6710474/mediaviewer/rm316021249/?ref_=tt_ov_i",
    Featured: false,
  },
  {
    Title: "Princess Mononoke",
    Description:
      "On a journey to find the cure for a Tatarigamis curse, Ashitaka finds himself in the middle of a war between the forest gods and Tatara, a mining colony. In this quest he also meets San, the Mononoke Hime.",
    Director: {
      Name: "Hayao Miyazaki",
      Bio: "Hayao Miyazaki is 1 of Japans greatest animation directors. The entertaining plots, compelling characters and breathtaking animation in his films have earned him international renown from critics as well as public recognition within Japan.",
      Birth: 1941.0,
    },
    Genre: {
      Name: "Animation",
      Description:
        "Animated films are ones in which individual drawings, paintings, or illustrations are photographed frame by frame (stop-frame cinematography).",
    },
    ImageURL:
      "https://www.imdb.com/title/tt0119698/mediaviewer/rm2697706753/?ref_=tt_ov_i",
    Featured: false,
  },
  {
    Title: "The Woman King",
    Description:
      "A historical epic inspired by true events that took place in The Kingdom of Dahomey, one of the most powerful states of Africa in the 18th and 19th centuries.",
    Director: {
      Name: "Gina Prince-Bythewood",
      Bio: "Gina Prince-Bythewood (Writer/Producer/Director) studied at UCLA Film School, where she received the Gene Reynolds Scholarship for Directing and the Ray Stark Memorial Scholarship for Outstanding Undergraduate. She was a member of UCLAs track and field team, qualifying for the Pac-10 Championships in the triple jump.",
      Birth: "June 10",
    },
    Genre: {
      Name: "Drama",
      Description:
        "Drama films are a genre that relies on the emotional and relational development of realistic characters. They often feature intense character development, and sometimes rely on tragedy to evoke an emotional response from the audience.",
    },
    ImageURL:
      "https://www.imdb.com/title/tt8093700/mediaviewer/rm913313025/?ref_=tt_ov_i",
    Featured: false,
  },
];

// allow new users to register (CREATE)
app.post("/users", (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send("users need names");
  }
});

// allow users to add a movie to their list of favorites (CREATE)
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send("bad request");
  }
});

//index greeting (READ)
app.get("/", (req, res) => {
  res.send("Welcome to my movie API!");
});

//return list of all movies to the user (READ)
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

//return data about a single movie by title to the user (READ)
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("bad request");
  }
});

//return data about a genre by name/title (READ)
app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("bad request");
  }
});

//return data about a director by name (READ)
app.get("/movies/directors/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(
    (movie) => movie.Director.Name === directorName
  ).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("bad request");
  }
});

// allow users to update their info (UPDATE)
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("bad request");
  }
});

// allow users to remove a movie from their list of favorites (DELETE)
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(
      (title) => title !== movieTitle
    );
    res
      .status(200)
      .send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send("bad request");
  }
});

// allow existing users to deregister (DELETE)
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    users = users.filter((user) => user.id != id);
    res.status(200).send(`user ${id} has been deleted`);
  } else {
    res.status(400).send("bad request");
  }
});

// log requests
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});
app.use(morgan("combined", { stream: accessLogStream }));
app.use(morgan("common"));

// error-handler to log application-level errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// serve documentation file from public folder
app.use(express.static("public"));

// listen for requests
app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
