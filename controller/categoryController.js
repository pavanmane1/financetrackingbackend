const CategoryService = require('../service/catagoryService');

class CategoryController {
    //  Get all categories
    static async getCategories(req, res, next) {
        try {
            const categories = await CategoryService.getAllCategories();
            res.status(200).json({ categories });
        } catch (error) {
            next(error);
        }
    }

    //  Get single category by ID
    static async getCategory(req, res, next) {
        try {
            const category = await CategoryService.getCategoryById(req.params.id);
            res.status(200).json({ category });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = CategoryController;
