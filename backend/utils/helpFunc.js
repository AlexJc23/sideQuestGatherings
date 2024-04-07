

const convertDate = (value) => {
    const date = new Date(value);
    const localTime = new Date(date.getTime() - (4 * 60 * 60 * 1000)); // Subtracting 4 hours in milliseconds
    const formattedLocalTime = localTime.toISOString().slice(0, 19).replace("T", " ");
    return formattedLocalTime
}


module.exports = {convertDate}
