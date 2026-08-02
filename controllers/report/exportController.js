const ExcelJS = require("exceljs");
const { Parser } = require("json2csv");

const User = require("../../models/User");
const Shayari = require("../../models/Shayari");
const Category = require("../../models/Category");
const Comment = require("../../models/Comment");
const Download = require("../../models/Download");

const logger = require("../../utils/logger");

exports.exportUsersCsv = async (req, res, next) => {

    try {

        const users = await User.find()
            .select("-password -resetPasswordToken -verificationToken")
            .lean();

        const parser = new Parser();

        const csv = parser.parse(users);

        res.header("Content-Type", "text/csv");

        res.attachment("users.csv");

        return res.send(csv);

    } catch (error) {

        logger.error(error);

        next(error);

    }

};

exports.exportShayariCsv = async (req, res, next) => {

    try {

        const shayari = await Shayari.find()
            .populate("category", "name")
            .lean();

        const parser = new Parser();

        const csv = parser.parse(shayari);

        res.header("Content-Type", "text/csv");

        res.attachment("shayari.csv");

        return res.send(csv);

    } catch (error) {

        logger.error(error);

        next(error);

    }

};

exports.exportCommentsCsv = async (req, res, next) => {

    try {

        const comments = await Comment.find()
            .populate("user", "name")
            .populate("shayari", "title")
            .lean();

        const parser = new Parser();

        const csv = parser.parse(comments);

        res.header("Content-Type", "text/csv");

        res.attachment("comments.csv");

        return res.send(csv);

    } catch (error) {

        logger.error(error);

        next(error);

    }

};

exports.exportDownloadsExcel = async (req, res, next) => {

    try {

        const workbook = new ExcelJS.Workbook();

        const sheet = workbook.addWorksheet("Downloads");

        sheet.columns = [

            { header: "User", key: "user", width: 30 },

            { header: "Shayari", key: "shayari", width: 40 },

            { header: "Downloaded At", key: "createdAt", width: 30 }

        ];

        const downloads = await Download.find()
            .populate("user", "name")
            .populate("shayari", "title");

        downloads.forEach(item => {

            sheet.addRow({

                user: item.user?.name,

                shayari: item.shayari?.title,

                createdAt: item.createdAt

            });

        });

        res.setHeader(

            "Content-Type",

            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

        );

        res.setHeader(

            "Content-Disposition",

            "attachment; filename=downloads.xlsx"

        );

        await workbook.xlsx.write(res);

        res.end();

    } catch (error) {

        logger.error(error);

        next(error);

    }

};

exports.exportDashboardSummary = async (req, res, next) => {

    try {

        const summary = {

            users: await User.countDocuments(),

            shayari: await Shayari.countDocuments(),

            categories: await Category.countDocuments(),

            comments: await Comment.countDocuments(),

            downloads: await Download.countDocuments()

        };

        res.json({

            success: true,

            summary

        });

    } catch (error) {

        logger.error(error);

        next(error);

    }

};
