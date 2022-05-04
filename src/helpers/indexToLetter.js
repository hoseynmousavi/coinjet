function indexToLetter(index)
{
    const library = {
        1: "اولین",
        2: "دومین",
        3: "سومین",
        4: "چهارمین",
        5: "پنجمین",
        6: "ششمین",
        7: "هفتمین",
        8: "هجدهمین",
        9: "نهمین",
        10: "دهمین",
    }

    return library[+index] || index
}

export default indexToLetter