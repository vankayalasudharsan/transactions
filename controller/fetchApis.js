const axios = require('axios');
const { where, Op, Sequelize } = require("sequelize");
const db = require('../models/index')
const response = require('../helper/response-helper');

exports.seedData = async (req, res) => {
    try {
        const responseJson = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = responseJson.data;

        if (data.length === 0) {
            return response.success(res, {
                statusCode: 200,
                message: "Data Not Found In Third Party Url",
            });
        }

        // Sync the model with the database
        await db.transactions.sync({ force: true });

        const formattedData = data.map(eachItem => ({
            title: eachItem.title,
            price: eachItem.price,
            description: eachItem.description,
            category: eachItem.category,
            image: eachItem.image,
            sold: eachItem.sold,
            dateOfSale: eachItem.dateOfSale
        }))

        // Insert seed data into the database
        await db.transactions.bulkCreate(formattedData);

        return response.success(res, {
            statusCode: 200,
            message: "Data Seeded Successfully",
        });

    } catch (e) {
        console.log("Error While Seeding Data:", e);
        return response.error(res, {
            statusCode: 500,
            message: "Something Went Woring",
        });
    }
}

exports.list = async (req, res) => {
    try {
        const { page, perPage = 10, searchInput, month } = req.query;

        const whereConditions = {
            dateOfSale: Sequelize.literal(`EXTRACT(MONTH FROM "dateOfSale") = ${month}`),
        };

        if (searchInput) {
            whereConditions[Op.or] = [
                Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('title')), 'LIKE', `%${searchInput.toLowerCase()}%`),
                Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('description')), 'LIKE', `%${searchInput.toLowerCase()}%`),
                {
                    price: {
                        [Op.or]: [
                            Sequelize.literal(`CAST("price" AS TEXT) LIKE '%${searchInput}%'`),
                            { [Op.eq]: searchInput }, // Exact match for numeric values
                        ],
                    },
                },
            ];
        }

        // Sequelize query
        const dd = await db.transactions.findAll({
            where: whereConditions,
            limit: perPage,
            offset: (page - 1) * perPage,
        });

        return response.success(res, {
            statusCode: 200,
            message: 'List Fetched Successfully',
            data: dd,
        });
    } catch (e) {
        console.log('Error While Fetching List:', e);
        return response.error(res, {
            statusCode: 500,
            message: 'Something Went Wrong',
        });
    }
};

exports.statistics = async (req, res) => {
    try {
        const { month } = req.query;

        // Total sale amount of selected month
        const totalSaleAmount = await db.transactions.sum('price', {
            where: {
                dateOfSale: Sequelize.literal(`EXTRACT(MONTH FROM "dateOfSale") = ${month}`),
                sold: true,
            },
        });

        // Total number of sold items of selected month
        const totalSoldItems = await db.transactions.count({
            where: {
                dateOfSale: Sequelize.literal(`EXTRACT(MONTH FROM "dateOfSale") = ${month}`),
                sold: true,
            },
        });

        // Total number of not sold items of selected month
        const totalNotSoldItems = await db.transactions.count({
            where: {
                dateOfSale: Sequelize.literal(`EXTRACT(MONTH FROM "dateOfSale") = ${month}`),
                sold: false,
            },
        });

        return response.success(res, {
            statusCode: 200,
            message: 'Statistics Fetched Successfully',
            data: {
                totalSaleAmount,
                totalSoldItems,
                totalNotSoldItems,
            },
        });
    } catch (e) {
        console.log('Error While Fetching Statistics:', e);
        return response.error(res, {
            statusCode: 500,
            message: 'Something Went Wrong',
        });
    }
};

exports.barChart = async (req, res) => {
    try {
      const { month } = req.query;
  
      // Define price ranges
      const priceRanges = [
        { min: 0, max: 100 },
        { min: 101, max: 200 },
        { min: 201, max: 300 },
        { min: 301, max: 400 },
        { min: 401, max: 500 },
        { min: 501, max: 600 },
        { min: 601, max: 700 },
        { min: 701, max: 800 },
        { min: 801, max: 900 },
        { min: 901, max: Infinity },
      ];
  
      // Initialize an object to store counts for each price range
      const priceRangeCounts = {};
  
      // Calculate counts for each price range
      for (const range of priceRanges) {
        const count = await db.transactions.count({
          where: {
            dateOfSale: Sequelize.literal(`EXTRACT(MONTH FROM "dateOfSale") = ${month}`),
            price: {
              [Op.and]: [
                { [Op.gte]: range.min },
                { [Op.lt]: range.max },
              ],
            },
          },
        });
  
        priceRangeCounts[`${range.min}-${range.max === Infinity ? 'above' : range.max}`] = count;
      }
  
      return response.success(res, {
        statusCode: 200,
        message: 'Bar Chart Data Fetched Successfully',
        data: priceRangeCounts,
      });
    } catch (e) {
      console.log('Error While Fetching Bar Chart Data:', e);
      return response.error(res, {
        statusCode: 500,
        message: 'Something Went Wrong',
      });
    }
};
  
exports.pieChart = async (req, res) => {
    try {
      const { month } = req.query;
  
      // Find unique categories and count of items for each category
      const categoryCounts = await db.transactions.findAll({
        attributes: ['category', [Sequelize.fn('COUNT', Sequelize.col('category')), 'itemCount']],
        where: {
          dateOfSale: Sequelize.literal(`EXTRACT(MONTH FROM "dateOfSale") = ${month}`),
        },
        group: ['category'],
        raw: true,
      });
  
      // Format the response
      const formattedData = categoryCounts.reduce((result, { category, itemCount }) => {
        result[category] = parseInt(itemCount);
        return result;
      }, {});
  
      return response.success(res, {
        statusCode: 200,
        message: 'Pie Chart Data Fetched Successfully',
        data: formattedData,
      });
    } catch (e) {
      console.log('Error While Fetching Pie Chart Data:', e);
      return response.error(res, {
        statusCode: 500,
        message: 'Something Went Wrong',
      });
    }
};

exports.combineData = async (req, res) => {
    try {
      const { month } = req.query;
  
      // Fetch data for Pie Chart (Category Counts)
      const categoryCounts = await db.transactions.findAll({
        attributes: ['category', [Sequelize.fn('COUNT', Sequelize.col('category')), 'itemCount']],
        where: {
          dateOfSale: Sequelize.literal(`EXTRACT(MONTH FROM "dateOfSale") = ${month}`),
        },
        group: ['category'],
        raw: true,
      });
  
      const pieChartData = categoryCounts.reduce((result, { category, itemCount }) => {
        result[category] = itemCount;
        return result;
      }, {});
  
      // Fetch data for Bar Chart (Price Range Counts)
      const priceRanges = [
        { min: 0, max: 100 },
        { min: 101, max: 200 },
        { min: 201, max: 300 },
        { min: 301, max: 400 },
        { min: 401, max: 500 },
        { min: 501, max: 600 },
        { min: 601, max: 700 },
        { min: 701, max: 800 },
        { min: 801, max: 900 },
        { min: 901, max: Infinity },
      ];
  
      const priceRangeCounts = {};
  
      for (const range of priceRanges) {
        const count = await db.transactions.count({
          where: {
            dateOfSale: Sequelize.literal(`EXTRACT(MONTH FROM "dateOfSale") = ${month}`),
            price: {
              [Op.and]: [
                { [Op.gte]: range.min },
                { [Op.lt]: range.max },
              ],
            },
          },
        });
  
        priceRangeCounts[`${range.min}-${range.max === Infinity ? 'above' : range.max}`] = count;
      }
  
      // Fetch data for Statistics
      const totalSaleAmount = await db.transactions.sum('price', {
        where: {
          dateOfSale: Sequelize.literal(`EXTRACT(MONTH FROM "dateOfSale") = ${month}`),
          sold: true,
        },
      });
  
      const totalSoldItems = await db.transactions.count({
        where: {
          dateOfSale: Sequelize.literal(`EXTRACT(MONTH FROM "dateOfSale") = ${month}`),
          sold: true,
        },
      });
  
      const totalNotSoldItems = await db.transactions.count({
        where: {
          dateOfSale: Sequelize.literal(`EXTRACT(MONTH FROM "dateOfSale") = ${month}`),
          sold: false,
        },
      });
  
      // Combine the responses
      const combinedData = {
        pieChart: pieChartData,
        barChart: priceRangeCounts,
        statistics: {
          totalSaleAmount,
          totalSoldItems,
          totalNotSoldItems,
        },
      };
  
      return response.success(res, {
        statusCode: 200,
        message: 'Combined Data Fetched Successfully',
        data: combinedData,
      });
    } catch (e) {
      console.log('Error While Fetching Combined Data:', e);
      return response.error(res, {
        statusCode: 500,
        message: 'Something Went Wrong',
      });
    }
};
  


