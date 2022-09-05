const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/articlesController");
const usersController = require("./users/UsersController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");


// View engine
app.set('view engine','ejs');

// Sessions, cookie tem time de milisegundos

app.use(session({
    secret: "qualquer coisa", cookie: { maxAge: 30000000 }
}))

//static
app.use(express.static('public'));


//Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//DataBase

connection      
    .authenticate()
    .then(() => {
        console.log("Conexao executada com sucesso!");
    }).catch((error) => {
        console.log("error");
    })

// Rota da pagina home

app.get("/", (req, res) => {

    Article.findAll({
        order:[
            ['id','DESC'],
        ],
        limit:4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});
        });
    });
})



//Controle de categorias e artigos (MVC)
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/",usersController);



app.get("/:slug",(req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch( err => {
        res.redirect("/");
    });
})

app.get("/category/:slug",(req, res) =>{
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then( category => {
        if(category != undefined){

            Category.findAll().then(categories => {
                res.render("index",{articles: category.articles,categories: categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch( err => {
            res.redirect("/");
    });
})

app.listen(8080, () => {
    console.log("o servidor esta rodando!")
})