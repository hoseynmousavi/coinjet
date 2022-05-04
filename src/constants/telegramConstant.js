const telegramConstant = {
    welcomeMsg: "به کوین‌جت خوش آمدید!\n" +
        "دیگر لازم نیست نگران از دست دادن سیگنال‌های خوب باشید و وقت زیادی صرف بررسی قیمت و ثبت سفارش کنید.\n" +
        "با استفاده از بات کوین‌جت می‌توانید حساب صرافی‌تان را به کانال سیگنال‌دهی محبوب خود متصل کنید تا کوین‌جت برای شما به صورت خودکار معامله کند.\n" +
        "کوین‌جت به هیچ وجه امکان برداشت از حساب شما را ندارد و اطلاعات دارایی‌های شما را نیز تنها به خودتان نمایش می‌دهد.",
    welcomeAddExchange: "در ادامه می‌توانید حساب صرافی‌های خود را به حساب کوین‌جت متصل کنید.\n",
    chooseExchangesForAdd: "از میان صرافی‌های زیر که ما آن‌ها را پشتیبانی می‌کنیم یکی را انتخاب کنید:",
    chooseExchangesForRemove: "لطفا حسابی که مایل به حذف آن هستید را انتخاب کنید:",
    youDontHaveUserExchange: "شما حساب صرافی ندارید.",
    removeUserExchangeDone: "حذف حساب صرافی با موفقیت انجام شد.",
    removeUserExchangeErr: "در حذف حساب صرافی مشکلی پیش آمد، بعدا دوباره تلاش کنید.",
    userExchange404: "شما حسابی با این نام ندارید.",
    sendYourCredentialsAndName: "برای اینکه بتوانید حساب‌های صرافی خود را از هم تفکیک کنید باید برای حساب خود نامی انتخاب کنید\n" +
        "همچنین لازم است به بخش اتصال API در حساب صرافی خود بروید و یک API جدید بسازید. اطلاعات API ساخته شده را به شکل زیر در اینجا وارد کنید:\n" +
        "Name, API Key, API Secret, API Passphrase\n" +
        "مثال:\n" +
        "MyKuCoin, 92640192872398752395, 9w8fysdfoghdf, cocococo",
    exchangeCompleted: "اطلاعات شما با موفقیت ثبت شد.\nHappy Trading 🙂",
    noUnCompletedExchange: "اطلاعات حساب صرافی‌های شما از قبل کامل است.",
    repeatedUserExchangeName: "نامی که انتخاب کردید تکراری است. نام دیگری انتخاب کنید.",
    notOk: "مفهوم پیام شما نامشخص است!",
    cancelBtn: "کنسل!",
    removeExchange: "Remove: ",
    overviewExchange: "Overview: ",
    positionsExchange: "My Positions: ",
    ordersExchange: "My Orders: ",
    userExchangeSpot: " (spot)",
    userExchangeFutures: " (futures)",
    cancelSignal: "برای کنسل کردن این سیگنال، دکمه زیر را فشار دهید.",
    connectionSucceed: "با موفقیت به اکانت شما متصل شدیم.",
    connectionFail: "در اتصال به اکانت شما با خطا مواجه شدیم.\n",
    signalFoundButNoBalance: "سیگنال جدیدی دریافت شد اما به دلیل کمبود موجودی حسابتان، سفارشی ثبت نشد.",
    signalFoundButNoCoinSupport: "سیگنال جدیدی دریافت شد اما صرافی کوکوین آن را ساپورت نمی‌کند.",
    signalFoundButErr: ({isFutures, pair}) => `یک سیگنال ${isFutures ? "Futures" : "Spot"} برای ${pair} رسید، اما این جفت‌ارز در صرافی Kucoin ${isFutures ? "Futures" : "Spot"} وجود نداشت و به همین دلیل برای شما اجرا نشد.`,
    signalFoundAndOrdersCreated: ({isFutures, ordersCount, pair}) => `سیگنال جدید!\nیک سیگنال ${isFutures ? "Futures" : "Spot"} برای ${pair} رسید و ${ordersCount} سفارش خرید برای شما ثبت شد.`,
    entryOrderFilledAndStopTpAdded: ({entryIndex, isFutures, pair, ordersCount}) => `${entryIndex} سفارش خرید سیگنال ${isFutures ? "Futures" : "Spot"} برای ${pair} پُر شد. ${ordersCount} سفارش فروش و استاپ‌لاس برای شما ثبت شد.`,
    entryOrderFilledAndStopTpFailed: ({entryIndex, isFutures, pair}) => `${entryIndex} سفارش خرید سیگنال ${isFutures ? "Futures" : "Spot"} برای ${pair} پُر شد، اما در بارگزاری استاپ‌لاس و سفارش‌های فروش مشکلاتی پیش آمد.`,
    stopSignalAndTpOrdersRemoved: ({lossInPercent, isFutures, pair}) => `٪${lossInPercent} ضرر!\nاستاپ‌لاس سیگنال ${isFutures ? "Futures" : "Spot"} برای ${pair} فعال شد.`,
    tpFilled: ({tpIndex, isFutures, pair, profitInPercent, firstTp}) => `${profitInPercent}٪ سود!\n$${tpIndex} سفارش فروش سیگنال ${isFutures ? "Futures" : "Spot"} برای ${pair} پُر شد.${firstTp ? " استاپ‌لاس به نقطه‌خرید منتقل شد." : ""}`,
    tpFilledButStopErr: ({tpIndex, isFutures, pair, profitInPercent}) => `${profitInPercent}٪ سود!\n$${tpIndex} سفارش فروش سیگنال ${isFutures ? "Futures" : "Spot"} برای ${pair} پُر شد، اما در بارگزاری استاپ‌لاس مشکلاتی پیش آمد.`,
}

export default telegramConstant