export function isNotEmpty(value) {
    return value.trim().length !== 0;
}

export function isValidEmail(value) {
    return value.includes("@");
}