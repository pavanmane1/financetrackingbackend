const Category = require('../model/Category');

class CategoryService {
    static async getAllCategories() {
        return await Category.findAll();
    }

    static async getCategoryById(id) {
        const category = await Category.findById(id);
        if (!category) {
            throw new Error('Category not found');
        }
        return category;
    }
}

module.exports = CategoryService;
