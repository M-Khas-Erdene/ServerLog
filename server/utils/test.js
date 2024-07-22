
const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    d.setHours(d.getHours() + 8);
    return d.toISOString().slice(0, 16);
};

module.exports = formatDate;
