const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const backupDir = path.join(__dirname, "../../backups");

if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

/**
 * Create MongoDB Backup
 */
exports.createBackup = () => {

    return new Promise((resolve, reject) => {

        const fileName = `backup-${Date.now()}.gz`;

        const output = path.join(
            backupDir,
            fileName
        );

        const command = `
mongodump \
--uri="${process.env.MONGODB_URI}" \
--archive="${output}" \
--gzip
`;

        exec(command, (error) => {

            if (error) {
                return reject(error);
            }

            resolve({
                success: true,
                fileName,
                path: output
            });

        });

    });

};

/**
 * Restore Backup
 */
exports.restoreBackup = (backupFile) => {

    return new Promise((resolve, reject) => {

        const command = `
mongorestore \
--uri="${process.env.MONGODB_URI}" \
--archive="${backupFile}" \
--gzip \
--drop
`;

        exec(command, (error) => {

            if (error) {
                return reject(error);
            }

            resolve(true);

        });

    });

};

/**
 * List Backups
 */
exports.listBackups = () => {

    return fs.readdirSync(backupDir)
        .filter(file => file.endsWith(".gz"))
        .map(file => {

            const full = path.join(
                backupDir,
                file
            );

            const stat = fs.statSync(full);

            return {

                file,

                size: stat.size,

                created: stat.birthtime

            };

        });

};

/**
 * Delete Backup
 */
exports.deleteBackup = (file) => {

    const target = path.join(
        backupDir,
        file
    );

    if (fs.existsSync(target)) {

        fs.unlinkSync(target);

    }

    return true;

};

/**
 * Delete Old Backups
 */
exports.cleanOldBackups = (days = 30) => {

    const files = fs.readdirSync(backupDir);

    const limit =
        Date.now() -
        days * 24 * 60 * 60 * 1000;

    files.forEach(file => {

        const full = path.join(
            backupDir,
            file
        );

        const stat = fs.statSync(full);

        if (stat.mtime.getTime() < limit) {

            fs.unlinkSync(full);

        }

    });

};

/**
 * Backup Information
 */
exports.info = (file) => {

    const full = path.join(
        backupDir,
        file
    );

    const stat = fs.statSync(full);

    return {

        file,

        size: stat.size,

        created: stat.birthtime,

        modified: stat.mtime

    };

};

/**
 * Backup Exists
 */
exports.exists = (file) => {

    return fs.existsSync(
        path.join(
            backupDir,
            file
        )
    );

};

/**
 * Backup Directory
 */
exports.directory = backupDir;
