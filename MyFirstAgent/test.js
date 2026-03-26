const holidays = [
    { name: "清明节", date: "2026-04-05" },
    { name: "劳动节", date: "2026-05-01" },
    { name: "端午节", date: "2026-06-19" }
];

const today = new Date();

for (let i = 0; i < holidays.length; i++) {
    const holiday = holidays[i];
    const days = Math.ceil((new Date(holiday.date) - today) / (1000 * 60 * 60 * 24));
    console.log(holiday.name + " 还有 " + days + " 天");
}