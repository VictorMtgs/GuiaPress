const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");
const Article = require("../articles/Article");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/categories/new", adminAuth,(req, res) => {
    res.render("admin/categories/new");
});
router.post("/categories/save",(req, res) => {
    var title = req.body.title;
    if(title != undefined){
        

        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/admin/categories");
    })


    }else{
        res.redirect("/admin/categories/new");
    }

});

router.get("/admin/categories", adminAuth,(req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/categories/index", {categories: categories});
    })
});

router.post("/categories/delete", adminAuth,(req, res) => {
    var id = req.body.id
    if(id != undefined){
        if(!isNaN(id)){
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories");
            });
        }else{// Nao for numero
            res.redirect("/admin/categories");
        }
    }else{// Nullo
        res.redirect("/admin/categories");
    }
});

router.get("/admin/categories/edit/:id", (req, res) => {
    var id = req.params.id;

    if(isNaN(id)){
        res.redirect("/admin/categories");
    }
    Category.findByPk(id).then(category => {
        if(category != undefined){
            res.render("admin/categories/edit",{category: category});
        }else{
            res.redirect("/admin/categories");
        }
    }).catch(erro => {
        res.redirect("/admin/categories");
    })
});

router.post("/articles/update", (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category

    Article.update({title: title, body: body, categoryId: category, slug:slugify(title)},{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(err => {
        res.redirect("/");
    });
});

module.exports = router;