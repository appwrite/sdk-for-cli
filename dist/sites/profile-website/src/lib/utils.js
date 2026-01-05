"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = void 0;
exports.cn = cn;
const clsx_1 = require("clsx");
const tailwind_merge_1 = require("tailwind-merge");
function cn(...inputs) {
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
const formatDate = (date) => {
    const dateObject = new Date(date);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - dateObject.getTime();
    const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
    if (months > 12)
        return years === 1 ? `${years} year ago` : `${years} years ago`;
    if (months > 0)
        return months === 1 ? `${months} month ago` : `${months} months ago`;
    if (days > 0)
        return days === 1 ? `${days} day ago` : `${days} days ago`;
    if (hours > 0)
        return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
    if (minutes > 0)
        return minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`;
    return "few seconds ago";
};
exports.formatDate = formatDate;
//# sourceMappingURL=utils.js.map