export const validateRequired = (resource, value) => {
    if (Array.isArray(value)) {
        if (value.length <= 0) {
            return `Please select at least one ${resource}`;
        }
    }
    else {
        if (value === undefined ||
            value === null ||
            (typeof value === "string" && value.trim() === "")) {
            return `${resource} is required`;
        }
    }
    return true;
};
//# sourceMappingURL=validations.js.map