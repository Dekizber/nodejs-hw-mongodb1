const parsedNumber = (number, defaultValue) => {
    if (typeof number !== 'string') return defaultValue;
    const parsedNumber = parseInt(number);
    if (Number.isNaN(parsedNumber)) return defaultValue;

    return parsedNumber;
};

export const parsePaginationParams = (req, res, next) => {
    const { page, perPage } = req.query;
    const parsedPage = parsedNumber(page, 1);
    const parsedPerPage = parsedNumber(perPage, 10);

    req.query = {
        ...req.query,
        page: parsedPage,
        perPage: parsedPerPage,
    };
    next();
};
