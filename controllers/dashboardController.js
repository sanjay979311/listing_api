

import Category from "../models/categoryModel.js";
import SubCategory from "../models/subCategoryModel.js";
import Order from "../models/orderModel.js";
import User from "../models/user.js";
import Banner from "../models/bannerModel.js";
import Country from "../models/countryModel.js";
import State from "../models/stateModel.js";
import City from "../models/cityModel.js";


export const getDashboardStats = async (req, res) => {
    try {
        const [

            totalCategories,

            totalOrders,
            totalCustomers,
            totalEmployees,
            totalBanners,
            totalCountries,
            totalStates,
            totalCities,

        ] = await Promise.all([
           
            Category.countDocuments({}),
            SubCategory.countDocuments({}),
            Order.countDocuments({}),
            User.countDocuments({ role: "doctor" }),
            User.countDocuments({ role: "patient " }),

            Country.countDocuments({}),
            State.countDocuments({}),
            City.countDocuments({}),


        ]);

        res.status(200).json({
            success: true,
            revenue: 486.15, // TODO: Replace with actual revenue calculation

            totalCategories,

            totalOrders,
            totalCustomers,
            totalEmployees,
            totalBanners,
            totalCountries,
            totalStates,
            totalCities,

        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ success: false, message: "Failed to fetch dashboard stats" });
    }
};
