const path = require("path");
const fs = require("fs/promises");
const ExcelJS = require("exceljs");
const { Parser } = require("json2csv");

const Report = require("../../models/Report");
const logger = require("../../utils/logger");

class ReportService {

    async saveHistory(data) {

        return Report.create(data);

    }

    async exportCsv(data, fileName) {

        const parser = new Parser();

        const csv = parser.parse(data);

        const reportsDir = path.join(
            process.cwd(),
            "reports"
        );

        await fs.mkdir(reportsDir, {
            recursive: true
        });

        const filePath = path.join(
            reportsDir,
            fileName
        );

        await fs.writeFile(
            filePath,
            csv,
            "utf8"
        );

        return filePath;

    }

    async exportExcel(data, fileName) {

        const workbook = new ExcelJS.Workbook();

        const sheet = workbook.addWorksheet("Report");

        if (data.length > 0) {

            sheet.columns = Object.keys(data[0]).map(key => ({

                header: key,

                key,

                width: 30

            }));

            data.forEach(item => {

                sheet.addRow(item);

            });

        }

        const reportsDir = path.join(
            process.cwd(),
            "reports"
        );

        await fs.mkdir(
            reportsDir,
            {
                recursive: true
            }
        );

        const filePath = path.join(
            reportsDir,
            fileName
        );

        await workbook.xlsx.writeFile(
            filePath
        );

        return filePath;

    }

    async deleteExpiredReports() {

        const reports = await Report.find({

            expiresAt: {

                $lte: new Date()

            }

        });

        for (const report of reports) {

            try {

                await fs.unlink(
                    report.filePath
                );

            } catch (err) {

                logger.warn(err.message);

            }

            await report.deleteOne();

        }

    }

    async getUserReports(userId) {

        return Report.find({

            generatedBy: userId

        }).sort({

            createdAt: -1

        });

    }

    async increaseDownload(reportId) {

        return Report.findByIdAndUpdate(

            reportId,

            {

                $inc: {

                    downloadCount: 1

                }

            },

            {

                new: true

            }

        );

    }

    async statistics() {

        const reports = await Report.countDocuments();

        const completed = await Report.countDocuments({

            status: "completed"

        });

        const failed = await Report.countDocuments({

            status: "failed"

        });

        const processing = await Report.countDocuments({

            status: "processing"

        });

        return {

            reports,

            completed,

            failed,

            processing

        };

    }

}

module.exports = new ReportService();
