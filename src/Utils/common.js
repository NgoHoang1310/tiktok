const convertTimeToISO = (time) => {
    const datePart = time.split('T')[0];
    return datePart;
};

export { convertTimeToISO };
