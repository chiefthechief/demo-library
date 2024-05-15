const { body, validationResult } = require("express-validator");
const Book = require("../models/book");
const BookInstance = require("../models/bookinstance");

let bookinstance_list = function (req, res, next) {
   BookInstance.find()
      .populate("book")
      .exec(function (err, list_bookinstances) {
         if (err) {
            return next(err);
         }
         res.render("bookinstance_list", {
            title: "Book Instance List",
            bookinstance_list: list_bookinstances,
         });
      });
}
let bookinstance_detail = (req, res, next) => {
   BookInstance.findById(req.params.id)
      .populate("book")
      .exec((err, bookinstance) => {
         if (err) {
            return next(err);
         }
         if (bookinstance == null) {
            const err = new Error("Book copy not found");
            err.status = 404;
            return next(err);
         }
         res.render("bookinstance_detail", {
            title: `Copy: ${bookinstance.book.title}`,
            bookinstance,
         });
      });
}
let bookinstance_create_get = (req, res, next) => {
   Book.find({}, "title").exec((err, books) => {
      if (err) {
         return next(err);
      }
      res.render("bookinstance_form", {
         title: "Create BoookInstance",
         book_list: books,
      });
   });
};
let bookinstance_create_post = [
   body("book", "Book must be specified")
      .trim().isLength({ min: 1 })
      .escape(),
   body("imprint", "Imprint must be specified")
      .trim()
      .isLength({ min: 1 })
      .escape(),
   body("status").escape(),
   body("due_back", "Invalide date")
      .optional({ checkFalsy: true })
      .isISO8601()
      .toDate(),
   (req, res, next) => {
      const errors = validationResult(req);
      const bookinstance = new BookInstance({
         book: req.body.book,
         imprint: req.body.imprint,
         status: req.body.status,
         due_back: req.body.due_back,
      });
      if (!errors.isEmpty()) {
         Book.find({}, "title").exec(function (err, books) {
            if (err) {
               return next(err);
            }
            res.render("bookinstance_form", {
               title: "Create BookInstance",
               book_list: books,
               selected_book: bookinstance.book._id,
               errors: errors.array(),
               bookinstance,
            });
         });
         return;
      }
      bookinstance.save((err) => {
         if (err) {
            return next(err);
         }
         res.redirect(bookinstance.url);
      })
   }
]
let bookinstance_delete_get = (req, res) => {
   res.send("NOT IMPLEMENTED: Bookinstance delete GET");
};
let bookinstance_delete_post = (req, res) => {
   res.send("NOT IMPLEMENTED: Bookinstance update GET");
};
let bookinstance_update_get = (req, res) => {
   res.send("NOT IMPLEMENTED: Bookinstance update GET");
};
let bookinstance_update_post = (req, res) => {
   res.send("NOT IMPLEMENTED: Bookinstance update POST");
};
module.exports = {
   bookinstance_list,
   bookinstance_detail,
   bookinstance_create_get,
   bookinstance_create_post,
   bookinstance_delete_get,
   bookinstance_delete_post,
   bookinstance_update_get,
   bookinstance_update_post
}