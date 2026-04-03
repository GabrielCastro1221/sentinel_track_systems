const ticketNumberRandom = async () => {
    const { v4: uuidv4 } = await import("uuid").then(mod => mod);
    return uuidv4();
};

module.exports = { ticketNumberRandom };
