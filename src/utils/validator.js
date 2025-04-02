export const numberValidator = (rule, value) => {
    return value > 0;
};
export const millionValidator = (rule, value) => {
    return value >= 1000000;
};

export const justNumber = (value) => !value || /^\d+$/.test(value);

export const useValidator = () => {
    return {
        numberValidator,
        millionValidator,
        justNumber,
    }
}